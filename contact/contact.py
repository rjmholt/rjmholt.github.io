from base64 import b64decode

x = b64decode(b'O1E8VDtXI2MEaQhhDSNAL0I=')
k = 0x49
a = []
for b in x:
    r = b ^ k
    a.append(r)
    k ^= r

print(bytes(a).decode('utf-8'))
