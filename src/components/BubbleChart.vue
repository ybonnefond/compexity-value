<template>
  <div>
    <modal :show="showModal" @close="resetLinks()">
      <div v-for="link in links">
        <a target="_blank" :href="link">{{link}}</a>
      </div>
    </modal>
    <canvas ref="bubble-chart-canvas" width="800" height="400"></canvas>
  </div>
</template>

<script lang="ts">
  import Chart from 'chart.js';
  import {mapState} from "vuex";
  import Modal from './Modal';

  type Coordinates = { x: number, y: number};

  export default {
    name: "BubbleChart",
    components: {Modal},
    computed: {
      ...mapState(['issues', 'chartConfig']),
      datasets() {
        const isString = (v: any) => typeof v === 'string' && v.length > 0;

        if (['x', 'y'/*, 'r'*/].some((k) => {
          return !isString(this.chartConfig[k]);
        })) {
          return [];
        }

        return [
          {
            data: this.issues.map((issue) => {
              function randomFibo() {
                const values = [1, 2, 3, 5, 8];
                const i = Math.floor(Math.random() * values.length);
                return values[i];
              }

              const x = issue[this.chartConfig.x] || randomFibo();
              const y = issue[this.chartConfig.y] || randomFibo();
              const r = 15; //issue[this.chartConfig.r] * 5 + 10 || 10;

              return {
                x,
                y,
                r,
                tooltipLabel: `${issue['Issue key']}: ${issue.Summary}`,
                link: `https://jira.solocal.com/browse/${issue['Issue key']}`,
              }
            })
          }
        ]
      }
    },
    data() {
      return {
        ref: 'bubble-chart-canvas',
        ctx: null,
        chart: null,
        gradientRotation: 200,
        showModal: false,
        links: []
      }
    },
    mounted() {
      const elm = this.$refs[this.ref];
      // We can't access the rendering context until the canvas is mounted to the DOM.
      // Once we have it, provide it to all child components.
      this.ctx = elm.getContext('2d');
      // Resize the canvas to fit its parent's width.
      // Normally you'd use a more flexible resize system.
      elm.width = elm.parentElement.clientWidth - 30;
      elm.height = elm.parentElement.clientHeight


      this.chart = new Chart(this.ctx, {
        type: 'bubble',
        data: {},
        options: this.getDefaultOptions()
      });
    },
    methods: {
      showLinks(links) {
        this.links = links;
        this.showModal = true;
      },

      resetLinks() {
        this.links = [];
        this.showModal = false;
      },

      update() {
        this.chart.data.datasets = this.datasets;
        this.chart.options = this.getOptions();
        this.chart.update();
      },

      getDefaultOptions() {
        return {
          aspectRatio: 1,
          layout: {
            padding: { right: 30 }
          },
          legend: false,
          scales: {
            xAxes: this.getAxis('Business Value'),
            yAxes: this.getAxis('Complexity'),
          },
        }
      },
      getOptions() {
        const chart = this.chart;
        const options = {
          ...this.getDefaultOptions(),
          tooltipEvents: ['click'],
          tooltips: {
            mode: 'point',
            callbacks: {
              label: (tooltipItem, data) => {
                var {tooltipLabel} = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || {};
                return tooltipLabel;
              }
            }
          },
          onClick: (e: Event) => {
            const links = [];
            var elements = this.chart.getElementsAtEventForMode(e, 'nearest', { intersect: true });
            for(const element of elements) {
              const {link} = this.chart.data.datasets[element._datasetIndex].data[element._index];
              links.push(link);
            }
            this.showLinks(links);
          },
          elements: {
            point: {
              borderColor: this.getGradient(),
              backgroundColor: this.getGradient(),
              hoverBorderColor: this.getGradient(),
              hoverBackgroundColor: this.getGradient(),

              borderWidth: function(context: any) {
                return Math.min(Math.max(1, context.datasetIndex + 1), 8);
              },

              hoverBorderWidth: function(context: any) {
                var value = context.dataset.data[context.dataIndex];
                return Math.round(8 * value.v / 1000);
              },

              radius: function(context: any) {
                var value = context.dataset.data[context.dataIndex];
                var size = context.chart.width;
                var base = Math.abs(value.v) / 1000;
                return (size / 24) * base;
              }
            }
          }
        };

        return options;
      },

      getAxis(title) {
        const axisColor = 'rgb(102,102,102)';
        return [{
          // type: 'category',
          // labels: ticks,
          ticks: {
            beginAtZero: true,
            suggestedMax: 9
          },
          color: axisColor,
          gridLines: {
            color: axisColor,
          },
          scaleLabel: {
            display: true,
            labelString: title
          }
        }]
      },

      rotateCoordinates(point: Coordinates, center: Coordinates, angle: number) {
        // translate to the center
        const t = {
          x: point.x - center.x,
          y: point.y - center.y;
        };

        // rotate
        const r = {
          x: t.x * Math.cos(angle) - t.y * Math.sin(angle),
          y: t.x * Math.sin(angle) + t.y * Math.cos(angle),
        };

        return {
          x: r.x + center.x,
          y: r.y + center.y
        };
      },

      getAngle(left: number, top: number, right: number, bottom: number) {
        return Math.atan((right - left) / (bottom - top)) * 180/Math.PI;
      },

      getGradient(opacity = 1) {
        return (context: any) => {
          const {left, top, right, bottom} = context.chart.chartArea;

          const center = {x: left + (right - left) / 2, y: top + (bottom - top) / 2};
          const bc = bottom - top;
          const ab = right - left;
          const ac = Math.sqrt(Math.pow(bc, 2) + Math.pow(ab, 2));

          const sinTeta = ab / ac;
          const cosTeta = bc / ac;

          const p0 = { x: left, y: center.y };
          const p1 = { x: right, y :center.y};

          function rotate(p) {
            // translate to center
            const t = { x:p.x - center.x, y: p.y - center.y };
            // rotate
            const r = {
              x: t.x * cosTeta - t.y * sinTeta,
              y: t.x * sinTeta + t.y * cosTeta
            };

            // translate back
            return {
              x: center.x + r.x,
              y: center.y + r.y,
            };
          }

          function getGradient(ctx, w, z) {
            const grd = ctx.createLinearGradient(w.x, w.y, z.x, z.y);
            const red = `rgb(250,85,85, 1)`;
            const yellow = `rgb(230,255,140, 1)`;
            const green = `rgb(130,230,100, 1)`;
            grd.addColorStop(0.3, red);
            grd.addColorStop(0.5, yellow);
            grd.addColorStop(0.7, green);

            return grd;
          }

          return getGradient(context.chart.chart.ctx, rotate(p0), rotate(p1));
        }
      }
    },
    watch: {
      chartConfig() {
        this.update();
      },
      issues() {
        this.update();
      }
    }
  }
</script>

<style lang="scss">

</style>
