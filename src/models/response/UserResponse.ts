import { type ISubscription } from '../ISubscription'
import { type IReferral } from '../IReferral'
import { type ILastOperation } from '../ILastOperation'

export interface UserResponse {
	subscription: ISubscription;
	referral: IReferral;
	last_operations: ILastOperation
}