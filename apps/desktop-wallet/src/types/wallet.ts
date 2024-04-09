/*
Copyright 2018 - 2024 The Alephium Authors
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

import { NonSensitiveAddressData } from '@alephium/keyring'

import { AddressBase } from '@/types/addresses'
import { TimeInMs } from '@/types/numbers'

export type ActiveWallet = {
  id: string
  name: string
  isPassphraseUsed: boolean
}

export type GeneratedWallet = {
  wallet: StoredEncryptedWallet
  initialAddress: AddressBase
}

export type UnlockedWallet = {
  wallet: ActiveWallet
  initialAddress: NonSensitiveAddressData
}

// encrypted is a stringified instance of EncryptedMnemonicStoredAsString or EncryptedMnemonicStoredAsUint8Array
// containing the mnemonic together with metadata.
export type StoredEncryptedWallet = Omit<ActiveWallet, 'isPassphraseUsed'> & {
  encrypted: string
  lastUsed: TimeInMs
}
