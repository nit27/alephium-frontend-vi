// Copyright 2018 The Alephium Authors
// This file is part of the alephium project.
//
// The library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the library. If not, see <http://www.gnu.org/licenses/>.

import dayjs from 'dayjs'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { APIContext } from '..'
import PageTitle from '../components/PageTitle'
import { Transaction } from '../types/api'
import { APIError } from '../utils/client'
import Badge from '../components/Badge'
import { Table, TableBody, HighlightedCell } from '../components/Table'
import { InputAddressLink, OutputAddressLink } from '../components/Links'
import styled from 'styled-components'
import Amount from '../components/Amount'

interface ParamTypes {
  id: string
}

const TransactionInfoSection = () => {
  const { id } = useParams<ParamTypes>()
  const client = useContext(APIContext).client
  const [txInfo, setTxInfo] = useState<Transaction & APIError>()

  useEffect(() => {
    (async () =>
      setTxInfo(await client.transaction(id))
    )()
  }, [client, id])

  return (
    <section>
      {!txInfo?.status ? <>
      <PageTitle title="Transaction" />
      <Table>
        <TableBody>
          <tr><td>Hash</td><HighlightedCell>{txInfo?.hash}</HighlightedCell></tr>
          <tr><td>Timestamp</td><td>{dayjs(txInfo?.timestamp).format('YYYY/MM/DD HH:mm:ss')}</td></tr>
          <tr><td>Inputs</td><td>{txInfo?.inputs.map((v, i) => <InputAddressLink address={v.address} txHashRef={v.txHashRef} maxCharacters={24} key={i} />)}</td></tr>
          <tr><td>Outputs</td><td>{txInfo?.outputs.map((v, i) => <AddressAndAmount key={i}><OutputAddressLink address={v.address} maxCharacters={24} /> <Amount value={v.amount} /></AddressAndAmount>)}</td></tr>
          <tr><td><b>Total value</b></td><td><Badge type={'neutral'}>{txInfo?.outputs.reduce<bigint>((acc, o) => (acc + BigInt(o.amount)), BigInt(0)).toString()} א</Badge></td></tr>
        </TableBody>
      </Table>
      </> : <span>{txInfo?.detail}</span>}
    </section>
  )
}

const AddressAndAmount = styled.div`
  div {
    float: left;
    margin-right: 25px;
  }
`

export default TransactionInfoSection