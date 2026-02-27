from typing import Optional

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings using Pydantic for validation.
    Standardized on SUPABASE_URL and SUPABASE_ANON_KEY.
    """

    supabase_url: Optional[str] = None
    supabase_anon_key: Optional[str] = Field(
        default=None, validation_alias=AliasChoices("SUPABASE_ANON_KEY", "SUPABASE_KEY")
    )

    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True, extra="ignore")

    @property
    def is_supabase_configured(self) -> bool:
        return bool(self.supabase_url and self.supabase_anon_key)


settings = Settings()
