import React, { FunctionComponent } from 'react'
import {
  RiskLegend,
  RiskLegendItem,
  RiskLegendMarker,
  RiskMeterCircle,
  RiskMeterContainer,
  RiskMeterWrapper,
  Spike
} from './styled'

const mix = (start: number, end: number, percent: number): number => Math.round(end * percent + start * (1 - percent))

const RiskMeterArrow: FunctionComponent<{ fill: string; rotate: number }> = ({ fill, rotate }) => (
  <svg
    width="45"
    height="83"
    viewBox="0 0 45 83"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      transform: `rotate(${rotate - 125}deg)`,
      transformOrigin: '10px 73px',
      position: 'absolute',
      top: '13px',
      left: '50%',
      marginLeft: '-11px'
    }}
  >
    <path
      d="M10.2632 83C15.9313 83 20.5263 78.3992 20.5263 72.7238C20.5263 67.0484 15.9313 62.4476 10.2632 62.4476C4.59497 62.4476 0 67.0484 0 72.7238C0 78.3992 4.59497 83 10.2632 83Z"
      fill={fill}
    />
    <path d="M0.789551 68.7714L19.7369 76.6762L45.0001 0L0.789551 68.7714Z" fill={fill} />
    <circle cx="10" cy="73" r="4" fill="#1E1D1E" />
  </svg>
)

const RiskMeter: FunctionComponent<{
  risk: number
}> = ({ risk }) => (
  <RiskMeterWrapper>
    <p>Your Margin Risk Level is</p>
    <p>
      <span>{`${Math.floor(risk)}.${String(Math.round(risk * 10)).padStart(2, '0')[1]}`}</span>
      {` ${risk < 3 ? 'Low' : risk <= 7 ? 'Medium' : 'High'} Risk`}
    </p>
    <RiskMeterContainer>
      {new Array(46).fill(null).map((_, index) => (
        <Spike index={index} risk={risk} key={index} />
      ))}
      <RiskMeterCircle>
        <RiskMeterArrow
          fill={
            risk <= 5
              ? `rgb(${mix(20, 153, risk / 5)}, ${mix(86, 6, risk / 5)}, 255)`
              : `rgb(${mix(153, 229, (risk - 5) / 5)}, ${mix(6, 43, (risk - 5) / 5)}, ${mix(255, 99, (risk - 5) / 5)})`
          }
          rotate={Math.round(risk * 19.62)}
        />
      </RiskMeterCircle>
    </RiskMeterContainer>
    <RiskLegend>
      <RiskLegendItem>
        <RiskLegendMarker color="#1456FF" />
        Low risk
      </RiskLegendItem>
      <RiskLegendItem>
        <RiskLegendMarker color="#9906FE" />
        Medium risk
      </RiskLegendItem>
      <RiskLegendItem>
        <RiskLegendMarker color="#E52B63" />
        High risk
      </RiskLegendItem>
    </RiskLegend>
  </RiskMeterWrapper>
)

export default RiskMeter
