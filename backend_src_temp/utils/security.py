from passlib.context import CryptContext
import bcrypt
import re

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against a hashed password.
    """
    # Decode the hashed_password if it's in bytes format
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    if isinstance(plain_password, str):
        plain_password = plain_password.encode('utf-8')

    try:
        # Try using passlib first
        return pwd_context.verify(plain_password.decode('utf-8'), hashed_password.decode('utf-8'))
    except:
        # Fallback to bcrypt directly
        return bcrypt.checkpw(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Generate a hash for a plaintext password.
    Truncates password to 72 characters if needed for bcrypt compatibility.
    """
    # Bcrypt has a maximum password length of 72 bytes
    # Truncate if necessary to avoid ValueError
    if len(password) > 72:
        password = password[:72]

    # Try using passlib first
    try:
        return pwd_context.hash(password)
    except:
        # Fallback to bcrypt directly
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')


def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate password strength according to security standards.
    Returns (is_valid, error_message).
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if len(password) > 128:  # Reasonable upper limit
        return False, "Password must not exceed 128 characters"
    
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r"\d", password):
        return False, "Password must contain at least one digit"
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character"
    
    return True, ""