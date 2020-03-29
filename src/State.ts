import {ChartConfig} from "./entities/ChartConfig";
import {Issue} from "./entities/Issue";
import {Keys} from "./entities/Key";

export interface State {
  file: File | null,
  issues: Issue[],
  keys: Keys,
  chartConfig: ChartConfig | null
}
