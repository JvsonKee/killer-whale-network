import { Node } from '@/app/types/node';

export interface Link {
	'source': string | Node,
	'target': string | Node,
}
