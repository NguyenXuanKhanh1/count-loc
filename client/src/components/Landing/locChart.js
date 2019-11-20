import React, { PureComponent } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Table, Grid } from 'semantic-ui-react';
const randomColor = require('randomcolor');
// const ignoreLangs = [
//   'csproj',
//   'user',
//   'sln',
//   'config',
//   'pubxml',
//   'gitignore',
//   'cache',
//   'targets'
// ];
const recognizedLang = [
  'js',
  'ts',
  'cs',
  'js',
  'vue',
  'html',
  'css',
  'scss',
  'java',
  'json'
];
let legendColor = [];
const generateColor = langs => {
  return langs.map(lang => ({
    lang: lang,
    color: randomColor(),
    extension: lang
  }));
};

const extractLang = data => {
  const langs = [];
  Object.keys(data).forEach(key =>
    data[key].forEach(d => langs.push(d.extension))
  );
  return [...new Set(langs)].filter(lang => recognizedLang.includes(lang));
};

const generateLoC = (langs, locs) =>
  langs
    .map(lang => ({ lang: lang, loc: locs[lang] }))
    .sort((a, b) => b.loc - a.loc)
    .filter(loc => recognizedLang.includes(loc.lang));

const findColorByLang = lang => legendColor.find(le => le.lang === lang).color;

export default class LocChart extends PureComponent {
  render() {
    legendColor = generateColor(extractLang(this.props.data));
    return (
      <div>
        {Object.keys(this.props.data).map(
          key =>
            !this.props.data[key].every(
              data =>
                (data.added === '' || data.added === '0') &&
                (data.deleted === '' || data.deleted === '0')
            ) && <Chart key={key} data={this.props.data[key]} author={key} />
        )}
      </div>
    );
  }
}

const LocTable = ({ langs, loc }) => {
  const data = generateLoC(langs, loc);
  return (
    <Table color='purple'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Language</Table.HeaderCell>
          <Table.HeaderCell textAlign='right'>Lines of Code</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map(
          d =>
            d.loc !== '0' && (
              <Table.Row>
                <Table.Cell>
                  <label style={{ color: findColorByLang(d.lang) }}>
                    {d.lang}
                  </label>
                </Table.Cell>
                <Table.Cell textAlign='right'>
                  <label style={{ color: findColorByLang(d.lang) }}>
                    {d.loc}
                  </label>
                </Table.Cell>
              </Table.Row>
            )
        )}
      </Table.Body>
    </Table>
  );
};

const Chart = ({ author, data }) => {
  const langs = [...new Set(data.map(d => d.extension))].filter(lang =>
    recognizedLang.includes(lang)
  );
  const current = {};
  const dataByLang = data
    .map(d => ({ ...d, [d.extension]: d.loc }))
    .reduce((acc, cur) => {
      const index = acc.findIndex(a => a.date === cur.date);
      if (index >= 0) {
        acc[index] = { ...acc[index], ...cur };
      } else {
        acc.push(cur);
      }
      return acc;
    }, [])
    .map(d => {
      langs.forEach(lang => {
        current[lang] = d[lang] ? d[lang] : current[lang] ? current[lang] : 0;
        d[lang] = current[lang];
      });
      return d;
    });

  if (langs.every(lang => current[lang] <= 0)) {
    return null;
  }

  const locTotal = langs.reduce((sum, lang) => {
    sum += parseInt(current[lang]);
    return sum;
  }, 0);

  return (
    <div>
      <Grid>
        <Grid.Column computer={4} mobile={16}>
          <div height={'30px'} />
          <h2>{author}</h2>
          <div>
            Productivity:{' '}
            <strong>{Math.round(locTotal / dataByLang.length)} </strong>{' '}
            <span style={{ color: 'gray' }}>LOC per day</span>
          </div>
          <div>
            Age: <strong>{dataByLang[0].date} </strong> ~{' '}
            <strong>{dataByLang[dataByLang.length - 1].date}</strong>
          </div>
          <LocTable langs={langs} loc={current} />
        </Grid.Column>
        <Grid.Column computer={12} mobile={16}>
          <ResponsiveContainer width='100%' height={320}>
            <AreaChart
              data={dataByLang}
              margin={{
                top: 30,
                right: 0,
                left: 0,
                bottom: 30
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date'>
                {/* <Label value={author} offset={-10} position='insideBottom' /> */}
              </XAxis>
              <YAxis />
              <Tooltip />
              {langs.map((lang, index) => {
                const color = findColorByLang(lang);
                return (
                  <Area
                    type='monotone'
                    dataKey={lang}
                    stackId={index}
                    stroke={color}
                    fill={color}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </Grid.Column>
      </Grid>
    </div>
  );
};
