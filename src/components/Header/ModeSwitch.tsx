import React, { useState } from 'react'
import LightIcon from '../../assets/svg/light_mode.svg'
import DarkIcon from '../../assets/svg/dark_mode.svg'
import styled from 'styled-components'

const Switch = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
`

const CheckBoxWrapper = styled.div`
  position: relative;
`
const CheckBoxLabel = styled.label`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: rgba(181, 181, 181, 0.25);
  cursor: pointer;
  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    margin: 5px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 44px;
  height: 20px;
  margin: 0;
  &:checked + ${CheckBoxLabel} {
    background: rgba(120, 120, 120, 0.25);
    &::after {
      content: '';
      background: #262626;
      display: block;
      border-radius: 50%;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`

export const ModeSwitch = () => {
  const [checked, setChecked] = useState(false)

  return (
    <Switch>
      <img src={checked ? DarkIcon : LightIcon} width={22} height={22} alt={checked ? 'dark' : 'light'} />
      <CheckBoxWrapper>
        <CheckBox id="checkbox" type="checkbox" onClick={() => setChecked(prev => !prev)} />
        <CheckBoxLabel htmlFor="checkbox" />
      </CheckBoxWrapper>
    </Switch>
  )
}
