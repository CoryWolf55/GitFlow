# schemas/user.py
from pydantic import BaseModel
from typing import Optional

class UserCreateDTO(BaseModel):
    github_id: int
    username: str
    access_token: str
    age: int
    password: str

    class Config:
        from_attributes = True


class UserResponseDTO(BaseModel):
    github_id: int
    username: str

    class Config:
        from_attributes = True

class UserLoginDTO(BaseModel):
    username: str
    password: str

    class Config:
        from_attributes = True

class UserLoginResponseDTO(BaseModel):
    github_id: int
    username: str
    age: Optional[int] = None

    class Config:
        from_attributes = True

class UserRegisterDTO(BaseModel):
    username: str
    password: str
    age: int | None = None

    class Config:
        from_attributes = True

class UserRegisterResponseDTO(BaseModel):
    github_id: int
    username: str
    age: int

    class Config:
        from_attributes = True