import moment from "moment"
import {DATE_FORMAT} from "../constants";

interface MomentHelpers {
    timeLeftBefore: (futureDate: string) => string
    getTimeLeftEnum: (futureDate: string) => 'weeks'|'days'|'hours'|'minutes'|'passed'
    getFormattedDate: (format: string, fromTimestamp?: number) => string
    isPast: (date: string, format: string) => boolean
    isFuture: (date: string, format: string) => boolean
    isValidDate: (date: string, format?: string) => boolean
    isRealisticFuture: (date: string, format?: string) => boolean
    toUnix: (date: string, format?: string) => number
}

type MomentInternalHelpers = Record<'weeks'|'days'|'hours'|'minutes', number>


export function useMoment(): MomentHelpers {
    return {

        timeLeftBefore: (futureDate: string): string => {

            const {weeks, days, hours, minutes} = getRemainingTime(futureDate)

            if (weeks > 1)
                return weeks + ' weeks left'
            if (days >= 1)
                return days + (days === 1 ? ' day' : ' days') + ' left'
            if (hours > 1)
                return hours +  ' hours left'
            if (minutes >= 0) {
                return minutes > 1 ? `${minutes} minutes left` : " minute left"
            }

            if (weeks < -1)
                return Math.abs(weeks) + ' weeks ago'
            if (days <= -1)
                return Math.abs(days) + (days === 1 ? ' day' : ' days') + ' ago'
            if (hours < -1)
                return Math.abs(hours) +  ' hours ago'

            return minutes < -1 ? `${Math.abs(minutes)} minutes ago` : " minute ago"
        },

        getTimeLeftEnum: (futureDate: string): 'weeks'|'days'|'hours'|'minutes'|'passed' => {
            const {weeks, days, hours, minutes} = getRemainingTime(futureDate)
            return (
                weeks >= 1 ? 'weeks' : (
                    days >= 1 ? 'days' : (
                        hours >= 1 ? 'hours' : (
                            minutes > 0 ? 'minutes' : 'passed'
                        )
                    )
                )
            )
        },

        getFormattedDate: (format: string, fromTimestamp?: number): string => moment(fromTimestamp).format(format),

        isPast: (date: string, format: string): boolean => {
            const assessedDate = moment(date, format)
            const now = moment()
            return assessedDate.isBefore(now)
        },

        isFuture: (date: string, format: string): boolean => {
            const assessedDate = moment(date, format)
            const now = moment()
            return assessedDate.isAfter(now)
        },

        isValidDate: (date: string, format: string = DATE_FORMAT) => {
            const assessedDate = moment(date, format, true);
            return assessedDate.isValid();
        },

        isRealisticFuture: (date: string, format: string = DATE_FORMAT) => {
            const assessedDate = moment(date, format, true);
            const now = moment()
            const lastAcceptableDate = moment().add(100, 'years');
            return assessedDate.isBetween(now, lastAcceptableDate)
        },

        toUnix: (date: string, format: string = DATE_FORMAT) => moment(date, format).valueOf()
    }
}


function getRemainingTime (futureDate: string): MomentInternalHelpers {
    const futureMoment = moment(futureDate, DATE_FORMAT);
    const currentMoment = moment();

    const duration = moment.duration(futureMoment.diff(currentMoment));
    const weeks = Math.floor(duration.asWeeks());
    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes());

    return {weeks, days, hours, minutes}
}