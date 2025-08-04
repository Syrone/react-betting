import { type IReferral } from '../IReferral'
import { type ILastOperation } from '../ILastOperation'

export interface UserResponse {
	subscription: {
		name: string;
		price: number;
		expires_at: number;
	};
	referral: IReferral;
	last_operations: ILastOperation
}