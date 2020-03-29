import Papa from 'papaparse';
import {Csv} from "../../../entities/Csv";
import {Issue, IssueValue} from "../entities/Issue";
import {Keys, KeyValue} from "../entities/Key";

interface ParserResult {
  issues: Issue[],
  keys: Record<string, string>
};

class Parser {
  public async parse(file: File): Promise<ParserResult> {
    const raw = String(await file.text());
    const {data} = Papa.parse(raw,  {
      header: true,
      skipEmptyLines: true
    });

    return this.adapt(data);
  }

  private adapt(items: Csv) {
    const issues = [];
    const keys: Keys = {};

    for(const item of items) {
      const issue: Issue = {};

      for(const k in item) {
        const value = this.parseValue(item[k]);
        if (!(k in keys) || 'null' === keys[k]) {
          keys[k] = this.typeofValue(value);
        }
        issue[k] = value;
      }

      issues.push(issue);
    }

    return { issues, keys: this.sortKeys(keys) };
  }

  private parseValue(v: string): IssueValue{
    if (v === '') {
      return null;
    }

    const num = Number(v);

    if (!isNaN(num)) {
      return num;
    }

    return v;
  }

  private typeofValue(v:IssueValue): KeyValue {
    if (null === v) {
      return 'null';
    }

    const type = typeof v;
    switch (type) {
      case 'number': return type;
      default: return 'string';
    }
  }

  private sortKeys<T>(unordered: Keys) {
    const ordered: Keys = {};
    Object.keys(unordered).sort().forEach(function(key) {
      ordered[key] = unordered[key];
    });

    return ordered;
  }
}

export default new Parser();
