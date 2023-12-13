import { ConsoleColors } from "../enums/ConsoleColors";
import { LogLevel } from "../enums/LogType";

export const LogTypeToColor : Record<LogLevel,ConsoleColors> = {
    [LogLevel.ERROR]: ConsoleColors.Red,
    [LogLevel.INFO]: ConsoleColors.Green,
    [LogLevel.WARN]: ConsoleColors.Yellow,
    [LogLevel.FATAL]: ConsoleColors.Red,
    [LogLevel.DEBUG]: ConsoleColors.Cyan,
    [LogLevel.INITIAL]: ConsoleColors.Regular,
    [LogLevel.HTTP]: ConsoleColors.Cyan,
};
