import unittest
from unittest.mock import MagicMock
from uuid import UUID

from models.schemas import LiftRequest, LiftResponse
from repositories.lifts import LiftsRepository
from services.lifts import LiftsService


class TestLiftsService(unittest.TestCase):
    def setUp(self):
        self.mock_repo = MagicMock(spec=LiftsRepository)
        self.service = LiftsService(self.mock_repo)

    def test_calculate_results(self):
        # Arrange
        request = LiftRequest(
            bodyweight=80.0,
            gender="male",
            equipment="raw",
            squat=200.0,
            bench=100.0,
            deadlift=250.0,
        )

        # Act
        result = self.service.calculate_results(request)

        # Assert
        self.assertEqual(result.total, 550.0)
        self.assertGreater(result.wilks, 0)
        self.assertGreater(result.dots, 0)
        self.assertGreater(result.ipf_gl, 0)
        self.assertGreater(result.reshel, 0)

    def test_create_lift_authenticated(self):
        # Arrange
        request = LiftRequest(
            bodyweight=80.0,
            gender="male",
            equipment="raw",
            squat=200.0,
            bench=100.0,
            deadlift=250.0,
        )
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        token = "fake-jwt-token"

        # Mock the repository return value
        expected_response = LiftResponse(
            id=UUID("550e8400-e29b-41d4-a716-446655440001"),
            user_id=UUID(user_id),
            bodyweight=80.0,
            gender="male",
            equipment="raw",
            squat=200.0,
            bench=100.0,
            deadlift=250.0,
            total=550.0,
            wilks=360.5,
            dots=370.2,
            ipf_gl=65.4,
            reshel=380.1,
        )
        self.mock_repo.create.return_value = expected_response

        # Act
        result = self.service.create_lift(request, user_id, token)

        # Assert
        self.assertEqual(result.id, expected_response.id)
        self.mock_repo.create.assert_called_once()
        # Verify the model passed to repo has user_id set
        passed_model = self.mock_repo.create.call_args[0][0]
        self.assertEqual(passed_model.user_id, UUID(user_id))

    def test_create_lift_anonymous(self):
        # Arrange
        request = LiftRequest(
            bodyweight=80.0,
            gender="male",
            equipment="raw",
            squat=200.0,
            bench=100.0,
            deadlift=250.0,
        )

        # Act
        result = self.service.create_lift(request, user_id=None, token=None)

        # Assert
        self.assertIsNone(result.user_id)
        self.mock_repo.create.assert_not_called()
        self.assertEqual(result.total, 550.0)

    def test_sync_lifts(self):
        # Arrange
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        token = "fake-jwt-token"
        lifts = [
            LiftResponse(
                bodyweight=80.0,
                gender="male",
                equipment="raw",
                squat=200.0,
                bench=100.0,
                deadlift=250.0,
                total=550.0,
                wilks=360.5,
                dots=370.2,
                ipf_gl=65.4,
                reshel=380.1,
            )
        ]
        self.mock_repo.bulk_create.return_value = lifts

        # Act
        result = self.service.sync_lifts(lifts, user_id, token)

        # Assert
        self.assertEqual(len(result), 1)
        self.assertEqual(lifts[0].user_id, UUID(user_id))
        self.mock_repo.bulk_create.assert_called_once_with(lifts, token)
