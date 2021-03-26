import styled from 'styled-components'

export const RiskMeterWrapper = styled.div`
  display: flex;
  align-self: stretch;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 230px;

  p {
    color: white;
    font-size: 14px;
    font-weight: 500;
    margin: 0;

    span {
      font-size: 18px;
    }
  }
`

export const RiskLegend = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
`

export const RiskLegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-size: 12px;
`

export const RiskLegendMarker = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  background-color: ${({ color }) => color};
  margin-right: 2px;
`

export const Spike = styled.div<{ index: number; risk: number }>`
  width: 4px;
  height: 26px;
  background: ${({ risk, index }) =>
    index >= Math.round(risk * 4.6) ? '#4F4F4F' : 'linear-gradient(to right, #1456FF 0%, #9906FE 50%, #E52B63 100%)'};
  background-size: 260px 4px;
  background-position: ${({ index }) => Math.round(index / 0.45)}% center;
  position: absolute;
  transform: rotate(${({ index }) => index * 4 - 90}deg);
  transform-origin: center 130px;
  top: 0;
  left: 50%;
  margin-left: -2px;
`

export const RiskMeterContainer = styled.div`
  position: relative;
  width: 260px;
  height: 130px;
  overflow: hidden;
  display: flex;
`

export const RiskMeterCircle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 0.5px solid #777777;
  position: absolute;
  bottom: -100px;
  left: 30px;
`
