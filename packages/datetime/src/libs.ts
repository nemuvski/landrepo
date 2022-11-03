import dayjs, { type Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.locale('ja')
dayjs.tz.setDefault('Asia/Tokyo')

/**
 * dayjsを利用するが、日付操作ライブラリを変えた際に名称が変わるため
 * プロジェクト内ではDateTimeという名称を使う
 */
export const datetime = dayjs
export type DateTime = Dayjs
