/// <reference types="vite-plugin-svgr/client" />

import React from "react"
import clsx from "clsx"

import styles from './Icon.module.scss'

import ArrowBottom from "../../assets/icons/arrow-bottom.svg?react"
import ArrowLeft from "../../assets/icons/arrow-left.svg?react"
import ArrowRight from "../../assets/icons/arrow-right.svg?react"
import ArrowTop from "../../assets/icons/arrow-top.svg?react"
import CalcFill from "../../assets/icons/calc-fill.svg?react"
import CalcStroke from "../../assets/icons/calc-stroke.svg?react"
import Calc from "../../assets/icons/calc.svg?react"
import Calendar from "../../assets/icons/calendar.svg?react"
import Check from "../../assets/icons/check.svg?react"
import CheckFill from "../../assets/icons/check-fill.svg?react"
import Close from "../../assets/icons/close.svg?react"
import Crown from "../../assets/icons/crown.svg?react"
import Downward from "../../assets/icons/downward.svg?react"
import Email from "../../assets/icons/email.svg?react"
import Error from "../../assets/icons/error.svg?react"
import EyeClose from "../../assets/icons/eye-close.svg?react"
import EyeOpen from "../../assets/icons/eye-open.svg?react"
import Location from "../../assets/icons/location.svg?react"
import Live from "../../assets/icons/live.svg?react"
import Menu from "../../assets/icons/menu.svg?react"
import Phone from "../../assets/icons/phone.svg?react"
import Reward from "../../assets/icons/reward.svg?react"
import Search from "../../assets/icons/search.svg?react"
import SortDown from "../../assets/icons/sort-down.svg?react"
import SortUp from "../../assets/icons/sort-up.svg?react"
import Sort from "../../assets/icons/sort.svg?react"
import Telegram from "../../assets/icons/telegram.svg?react"
import Time from "../../assets/icons/time.svg?react"
import Upward from "../../assets/icons/upward.svg?react"
import User from "../../assets/icons/user.svg?react"

type IconsMap = {
  [key: string]: React.FC<React.SVGProps<SVGSVGElement>>
}

const icons: IconsMap = {
  arrowBottom: ArrowBottom,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowTop: ArrowTop,
  calcFill: CalcFill,
  calcStroke: CalcStroke,
  calc: Calc,
  calendar: Calendar,
  check: Check,
  checkFill: CheckFill,
  close: Close,
  crown: Crown,
  downward: Downward,
  email: Email,
  error: Error,
  eyeClose: EyeClose,
  eyeOpen: EyeOpen,
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