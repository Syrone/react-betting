/// <reference types="vite-plugin-svgr/client" />

import React from "react"
import clsx from "clsx"

import styles from './Icon.module.scss'

import ArrowBottom from "@icons/arrow-bottom.svg?react"
import ArrowLeft from "@icons/arrow-left.svg?react"
import ArrowRight from "@icons/arrow-right.svg?react"
import ArrowTop from "@icons/arrow-top.svg?react"
import BitcoinPay from "@icons/bitcoin-pay.svg?react"
import Bitcoin from "@icons/bitcoin.svg?react"
import CalcFill from "@icons/calc-fill.svg?react"
import CalcStroke from "@icons/calc-stroke.svg?react"
import Calc from "@icons/calc.svg?react"
import Calendar from "@icons/calendar.svg?react"
import Check from "@icons/check.svg?react"
import CheckFill from "@icons/check-fill.svg?react"
import Close from "@icons/close.svg?react"
import Copy from "@icons/copy.svg?react"
import Credit from "@icons/credit.svg?react"
import Crown from "@icons/crown.svg?react"
import Cycle from "@icons/cycle.svg?react"
import Danger from "@icons/danger.svg?react"
import Downward from "@icons/downward.svg?react"
import Edit from "@icons/edit.svg?react"
import Email from "@icons/email.svg?react"
import Empty from "@icons/empty.svg?react"
import Error from "@icons/error.svg?react"
import EyeClose from "@icons/eye-close.svg?react"
import EyeOpen from "@icons/eye-open.svg?react"
import Google from "@icons/google.svg?react"
import Location from "@icons/location.svg?react"
import Live from "@icons/live.svg?react"
import Menu from "@icons/menu.svg?react"
import Phone from "@icons/phone.svg?react"
import Reward from "@icons/reward.svg?react"
import Search from "@icons/search.svg?react"
import SortDown from "@icons/sort-down.svg?react"
import SortUp from "@icons/sort-up.svg?react"
import Sort from "@icons/sort.svg?react"
import Telegram from "@icons/telegram.svg?react"
import Time from "@icons/time.svg?react"
import Upward from "@icons/upward.svg?react"
import Usdt from "@icons/usdt.svg?react"
import User from "@icons/user.svg?react"

type IconsMap = {
  [key: string]: React.FC<React.SVGProps<SVGSVGElement>>
}

const icons: IconsMap = {
  arrowBottom: ArrowBottom,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowTop: ArrowTop,
  bitcoinPay: BitcoinPay,
  bitcoin: Bitcoin,
  calcFill: CalcFill,
  calcStroke: CalcStroke,
  calc: Calc,
  calendar: Calendar,
  check: Check,
  checkFill: CheckFill,
  close: Close,
  copy: Copy,
  credit: Credit,
  crown: Crown,
  cycle: Cycle,
  danger: Danger,
  downward: Downward,
  edit: Edit,
  email: Email,
  empty: Empty,
  error: Error,
  eyeClose: EyeClose,
  eyeOpen: EyeOpen,
  google: Google,
  location: Location,
  live: Live,
  menu: Menu,
  phone: Phone,
  reward: Reward,
  search: Search,
  sortDown: SortDown,
  sortUp: SortUp,
  sort: Sort,
  telegram: Telegram,
  time: Time,
  upward: Upward,
  usdt: Usdt,
  user: User,
}

type IconProps = {
  name: keyof typeof icons,
  className?: string
}

const Icon: React.FC<IconProps> = ({ name, className }) => {
  const SvgIcon = icons[name]

  if (!SvgIcon) {
    console.warn(`Icon "${name}" not found`)
    return (
      <span className={clsx(
        styles.icon,
        className
        )}
        aria-hidden="true"></span>
    )
  }

  return (
		<span className={clsx(
      styles.icon,
      className
      )}
      aria-hidden="true">
			<SvgIcon />
		</span>
	)
}

export default Icon