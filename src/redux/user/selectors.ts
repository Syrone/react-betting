import { createSelector } from '@reduxjs/toolkit'
import { type RootState } from "@redux/store"

import { type ILastOperation } from '@models/ILastOperation'

export const selectorUser = (state: RootState) => state.user
export const selectorLastOperation = createSelector(
  (state: RootState) => state.user.data?.last_operations,
  (last_operations): ILastOperation => {
    return last_operations ?? { items: [], total_count: 0 }
  }
)
export const selectorOperationPage = (state: RootState) => state.user.operationsPage
export const selectorOperationStatus = (state: RootState) => state.user.opeartionsStatus