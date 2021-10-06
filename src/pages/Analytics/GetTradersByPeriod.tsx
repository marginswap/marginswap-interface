import React from 'react'
import { gql } from '@apollo/client'
import JSONPretty from 'react-json-pretty'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { avalancheClient } from '../../config/apollo-config'
import { getAvalancheTopTraders } from './utils'

function GetTradersByPeriod() {
  const [avaxTS, setAvaxTS] = React.useState<any>([])
  const [topTraders, setTopTraders] = React.useState<any[]>([])
  const { gte, lte } = useParsedQueryString()

  React.useEffect(() => {
    const getAvax = async (greater: number, less: number, first: number, skip: number) => {
      const { data } = await avalancheClient.query({
        query: gql`
          query swapsByPeriod($gte: Int, $lte: Int, $first: Int, $skip: Int) {
            swaps(
              where: { type: MARGIN, createdAt_gte: $gte, createdAt_lte: $lte }
              orderBy: createdAt
              first: $first
              skip: $skip
            ) {
              id
              trader
              fromAmount
              fromToken
              createdAt
            }
          }
        `,
        variables: {
          gte: greater,
          lte: less,
          first: first,
          skip: skip
        }
      })

      return data
    }

    const getTradersTotalsByPeriod = async () => {
      const avaxSwaps = []
      const first = 100
      let skip = 0
      while (true) {
        const daySwaps = await getAvax(Number(gte), Number(lte), first, skip)
        if (daySwaps.swaps.length === 0) break
        avaxSwaps.push(...daySwaps.swaps)
        skip += first
      }
      setAvaxTS(avaxSwaps)
    }

    if (gte && lte) {
      getTradersTotalsByPeriod()
    }
  }, [])

  React.useEffect(() => {
    const getTraderData = async (avalancheData: any) => {
      const tradersData = await getAvalancheTopTraders(avalancheData)
      setTopTraders(tradersData)
    }

    getTraderData(avaxTS)
  }, [avaxTS])

  return !gte || !lte ? (
    <div>No period selected</div>
  ) : (
    <JSONPretty id="json-pretty" data={topTraders} style={{ color: 'white' }}></JSONPretty>
  )
}

export default GetTradersByPeriod
