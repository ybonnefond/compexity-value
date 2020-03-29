import Vue from 'vue';
import Vuex, {ActionTree, MutationTree, StoreOptions} from 'vuex';
import {ChartConfig} from "./entities/ChartConfig";
import {Keys} from "./entities/Key";
import {State} from "./State";
import {Issue} from "./entities/Issue";
import parser from './services/parser';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

// initial state
const state: State = {
  file: null,
  issues: [],
  keys: {},
  chartConfig: {x: '', y: '', r: ''}
};

// getters
const getters = {
};

// actions
const actions: ActionTree<State, {}> = {
  async resetFile({commit,dispatch}, file: File) {
    dispatch('setFile', null);
  },
  async setFile({commit,dispatch}, file: File) {
    commit('SET_FILE', file);
    dispatch('parse');
  },
  async setIssues({commit,dispatch}, issues: Issue[]) {
    commit('SET_ISSUES', issues);
  },
  async setKeys({commit,dispatch}, keys: Keys) {
    commit('SET_KEYS', keys);
  },
  async setChartConfig({commit,dispatch}, config: ChartConfig) {
    commit('SET_CHART_CONFIG', config);
  },
  async parse({dispatch,state}) {
    let issues: Issue[] = [];
    let keys = {};

    if (null !== state.file) {
      const result = await parser.parse(state.file);
      issues = result.issues;
      keys = result.keys;
    }

    dispatch('setIssues', issues);
    dispatch('setKeys', keys);
  },
};

// mutations
const mutations: MutationTree<State> = {
  SET_FILE(state: State, file: File) {
    state.file = file;
  },
  SET_ISSUES(state: State, issues: Issue[]) {
    state.issues = issues;
  },
  SET_KEYS(state: State, keys: Keys) {
    state.keys = keys;
  },
  SET_CHART_CONFIG(state: State, config: ChartConfig) {
    state.chartConfig = config;
  },
};


const store: StoreOptions<State> = {
  state,
  mutations,
  actions,
  strict: debug
};

export default new Vuex.Store<State>(store);
