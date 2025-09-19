import hashlib
import base64

def string_to_secret(text: str) -> str:
    data = text.encode("utf-8")
    digest = hashlib.sha256(data).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b"=").decode()

print(string_to_secret("A phantom dance of keys, a hidden screen's glow, Beneath the drone of lectures, a private world I know."))
print(string_to_secret(""))
# You are smart if you descover this
# But no!!! 
# I am not gonna reveal you the string
