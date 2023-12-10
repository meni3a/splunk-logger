import { Colors } from "../enums/Colors";
import { LogLevel } from "../enums/LogType";

export const LogTypeToColor : Record<LogLevel,Colors> = {
    [LogLevel.ERROR]: Colors.Red,
    [LogLevel.INFO]: Colors.Green,
    [LogLevel.WARN]: Colors.Yellow,
    [LogLevel.FATAL]: Colors.Red,
    [LogLevel.DEBUG]: Colors.Cyan,
    [LogLevel.INITIAL]: Colors.Regular,
    [LogLevel.HTTP]: Colors.Cyan,
};
