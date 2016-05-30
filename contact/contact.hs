import Data.Char
import Data.Bits

o = 0x49
b = [59,81,60,84,59,87,35,99,4,105,8,97,13,35,64,47,66]

r _ []     = []
r k (c:cs) =
  let v = xor k c in
  (chr v) : r (k `xor` v) cs

main = print $ r o b
