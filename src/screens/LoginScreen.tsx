/*
Copyright 2018 - 2022 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

import { StackScreenProps } from '@react-navigation/stack'
import { useCallback, useState } from 'react'

import ConfirmWithAuthModal from '../components/ConfirmWithAuthModal'
import Screen from '../components/layout/Screen'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import RootStackParamList from '../navigation/rootStackRoutes'
import { activeWalletChanged } from '../store/activeWalletSlice'
import { addressesFlushed, addressesFromStoredMetadataInitialized } from '../store/addressesSlice'
import { pinEntered } from '../store/credentialsSlice'
import { ActiveWalletState } from '../types/wallet'
import { useRestoreNavigationState } from '../utils/navigation'

type ScreenProps = StackScreenProps<RootStackParamList, 'LoginScreen'>

const LoginScreen = ({
  navigation,
  route: {
    params: { walletIdToLogin, resetWalletOnLogin }
  }
}: ScreenProps) => {
  const dispatch = useAppDispatch()
  const restoreNavigationState = useRestoreNavigationState()
  const addressesStatus = useAppSelector((state) => state.addresses.status)

  const [isPinModalVisible, setIsPinModalVisible] = useState(true)

  const handleSuccessfulLogin = useCallback(
    async (pin?: string, wallet?: ActiveWalletState) => {
      if (!pin || !wallet) return

      setIsPinModalVisible(false)

      dispatch(pinEntered(pin))
      await dispatch(activeWalletChanged(wallet))

      if (resetWalletOnLogin) {
        dispatch(addressesFlushed())
      }

      if (resetWalletOnLogin || addressesStatus === 'uninitialized') {
        dispatch(addressesFromStoredMetadataInitialized())
      }

      restoreNavigationState(resetWalletOnLogin)
    },
    [addressesStatus, dispatch, resetWalletOnLogin, restoreNavigationState]
  )

  return (
    <Screen style={{ marginTop: 40 }}>
      {isPinModalVisible && (
        <ConfirmWithAuthModal usePin onConfirm={handleSuccessfulLogin} walletId={walletIdToLogin} />
      )}
    </Screen>
  )
}

export default LoginScreen
