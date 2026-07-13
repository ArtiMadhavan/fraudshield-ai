from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from app.core.database import get_db
from app.models.models import User
from app.schemas.schemas import Token, UserCreate, UserResponse
from app.auth import verify_password, get_password_hash, create_access_token, create_refresh_token, validate_password_strength, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if not validate_password_strength(user_in.password):
        raise HTTPException(status_code=400, detail="Password must be at least 8 chars long and contain uppercase, lowercase, digit, and special char.")
    
    db_user = db.query(User).filter(User.username == user_in.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    db_email = db.query(User).filter(User.email == user_in.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user_in.password)
    # Force role to customer for self-registration
    new_user = User(username=user_in.username, email=user_in.email, password_hash=hashed_password, role="customer")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    from sqlalchemy import or_
    user = db.query(User).filter(
        or_(User.username == form_data.username, User.email == form_data.username)
    ).first()
    
    if user:
        if user.is_locked:
            if user.locked_until and user.locked_until.replace(tzinfo=timezone.utc) > datetime.now(timezone.utc):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is locked due to multiple failed attempts.")
            else:
                # Lockout period expired
                user.is_locked = False
                user.failed_login_attempts = 0
                user.locked_until = None
                db.commit()

    if not user or not verify_password(form_data.password, user.password_hash):
        if user:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
                user.is_locked = True
                user.locked_until = datetime.utcnow() + timedelta(minutes=LOCKOUT_MINUTES)
            db.commit()
            
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Reset attempts on successful login
    if user.failed_login_attempts > 0:
        user.failed_login_attempts = 0
        db.commit()
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(
        data={"sub": user.username}
    )
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}
