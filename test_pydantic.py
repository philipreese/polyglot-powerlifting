from pydantic import BaseModel
from typing import Optional

class Model(BaseModel):
    x: Optional[int] = None
    y: int

m1 = Model(y=1)
m1.x = 2
print(m1.model_dump(exclude_unset=True))
