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

import { Asset } from '@alephium/sdk'
import { ALPH } from '@alephium/token-list'
import { Optional } from '@alephium/web3'
import { motion } from 'framer-motion'
import { RiErrorWarningFill } from 'react-icons/ri'
import styled, { useTheme } from 'styled-components'

import Amount from '@/components/Amount'
import AssetLogo from '@/components/AssetLogo'
import HashEllipsed from '@/components/HashEllipsed'
import SkeletonLoader from '@/components/SkeletonLoader'
import TableCellAmount from '@/components/Table/TableCellAmount'

interface TokenListProps {
  tokens: Optional<Asset, 'decimals'>[]
  limit?: number
  isLoading?: boolean
  className?: string
}

const TokenList = ({ tokens, limit, isLoading, className }: TokenListProps) => {
  const theme = useTheme()

  const displayedTokens = limit ? tokens.slice(0, limit) : tokens

  return (
    <motion.div className={className}>
      {displayedTokens.map((token) => (
        <AssetRow key={token.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AssetLogoStyled assetId={token.id} size={30} />
          <NameColumn>
            <TokenName>
              {token.name || <HashEllipsed hash={token.id} />}
              {token.id !== ALPH.id && !token.logoURI && token.name && <UnverifiedIcon data-tip="Unverified token" />}
            </TokenName>
            {token.symbol && <TokenSymbol>{token.symbol}</TokenSymbol>}
          </NameColumn>

          <TableCellAmount>
            <TokenAmount assetId={token.id} value={token.balance} suffix={token.symbol} decimals={token.decimals} />
            {token.lockedBalance > 0 ? (
              <TokenAmountSublabel>
                {'Available '}
                <Amount
                  assetId={token.id}
                  value={token.balance - token.lockedBalance}
                  suffix={token.symbol}
                  color={theme.font.secondary}
                  decimals={token.decimals}
                />
              </TokenAmountSublabel>
            ) : token.decimals === undefined ? (
              <TokenAmountSublabel>Raw amount</TokenAmountSublabel>
            ) : undefined}
          </TableCellAmount>
        </AssetRow>
      ))}
      {isLoading && (
        <LoadingRow>
          <SkeletonLoader height="40px" width="280px" />
          <SkeletonLoader height="25px" width="200px" />
        </LoadingRow>
      )}
    </motion.div>
  )
}

export default TokenList

const AssetRow = styled(motion.div)`
  display: flex;
  padding: 15px 20px;
  align-items: center;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.border.secondary};
  }
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const AssetLogoStyled = styled(AssetLogo)`
  margin-right: 20px;
`

const TokenName = styled.span`
  display: flex;
  gap: 5px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
`

const UnverifiedIcon = styled(RiErrorWarningFill)`
  fill: ${({ theme }) => theme.font.tertiary};
  margin-top: 1px;
`

const TokenSymbol = styled.div`
  color: ${({ theme }) => theme.font.secondary};
  max-width: 150px;
`

const TokenAmount = styled(Amount)`
  font-size: 14px;
`

const TokenAmountSublabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.font.secondary};
  font-weight: 400;
`

const NameColumn = styled(Column)`
  margin-right: 20px;
`

const LoadingRow = styled.div`
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
