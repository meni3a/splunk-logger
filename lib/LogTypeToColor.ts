import { Colors } from "./enums/Colors";
import { LogType } from "./enums/LogType";

export const LogTypeToColor : Record<LogType,Colors> = {
    [LogType.ERROR]: Colors.Red,
    [LogType.INFO]: Colors.Green,
    [LogType.WARN]: Colors.Yellow,
    [LogType.FATAL]: Colors.Red,
    [LogType.DEBUG]: Colors.Cyan,
    [LogType.INITIAL]: Colors.Regular,
    [LogType.HTTP]: Colors.Regular,
};
