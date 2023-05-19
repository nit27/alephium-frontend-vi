/*
Copyright 2018 - 2023 The Alephium Authors
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

import { TokenList } from '@alephium/token-list'
import { createAsyncThunk } from '@reduxjs/toolkit'

import i18n from '@/i18n'
import { RootState } from '@/storage/store'
import { AddressHash } from '@/types/addresses'
import { SnackbarMessage } from '@/types/snackbar'

export const syncNetworkTokensInfo = createAsyncThunk('assets/syncNetworkTokensInfo', async (_, { getState }) => {
  const state = getState() as RootState

  let metadata = undefined
  const network =
    state.network.settings.networkId === 0 ? 'mainnet' : state.network.settings.networkId === 1 ? 'testnet' : undefined

  if (network) {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/alephium/token-list/master/tokens/${network}.json`
      )
      metadata = (await response.json()) as TokenList
    } catch (e) {
      console.warn('No metadata for network ID ', state.network.settings.networkId)
    }
  }

  return metadata
})

export const receiveTestnetTokens = createAsyncThunk<undefined, AddressHash, { rejectValue: SnackbarMessage }>(
  'assets/receiveTestnetTokens',
  async (destinationAddress: AddressHash, { rejectWithValue }) => {
    const response = await fetch('https://faucet.testnet.alephium.org/send', {
      method: 'POST',
      body: destinationAddress
    })

    console.log(response)

    if (!response.ok) {
      return rejectWithValue({
        text: i18n.t('Encountered error while calling the faucet. Please try again in a few minutes.'),
        type: 'alert'
      })
    }
  }
)
