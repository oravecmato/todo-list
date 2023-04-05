import moment from "moment";
import {DATE_FORMAT} from "../constants";
import {useMoment} from "./useMoment";

interface CustomValidationRuleCollection {
    isDate: (val: string) => boolean
    futureDate: (val: string) => boolean
    realisticDate: (val: string) => boolean

}

const momentHelpers = useMoment()

export function useCustomVuelidateRules(): CustomValidationRuleCollection {
    return {
        isDate: (val: string) => momentHelpers.isValidDate(val, DATE_FORMAT),
        futureDate: (val: string) => momentHelpers.isFuture(val, DATE_FORMAT),
        realisticDate: (val: string) => momentHelpers.isRealisticFuture(val, DATE_FORMAT)
    }
}