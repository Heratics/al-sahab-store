import bcrypt from 'bcryptjs';
import { writeFileSync } from 'fs';
const hash = await bcrypt.hash('ADMIN123', 12);
writeFileSync('hash.txt', hash);
console.log(hash);
