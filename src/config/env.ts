import { resolve } from 'path';
import { config } from 'dotenv';

export default config({ path: resolve(__dirname, '../../.env')});