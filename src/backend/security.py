import bcrypt

def get_password_hash(password: str) -> str:
    """Hashes a plaintext password securely using bcrypt directly."""
    # bcrypt requires bytes, so we encode the standard string
    pwd_bytes = password.encode('utf-8')
    
    # Generate a secure salt and hash the password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password=pwd_bytes, salt=salt)
    
    # Decode back to a string so it can be stored cleanly in PostgreSQL
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plaintext password against a stored hash."""
    plain_pwd_bytes = plain_password.encode('utf-8')
    hashed_pwd_bytes = hashed_password.encode('utf-8')
    
    return bcrypt.checkpw(password=plain_pwd_bytes, hashed_password=hashed_pwd_bytes)