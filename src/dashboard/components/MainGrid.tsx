import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getApiUrl } from '../../helpers/utils';

import { Transaction } from '../../Components/Transaction/Transaction';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import React from 'react';
import { TransactionsGroupedByCategory } from '../../Interfaces/Interfaces';
import { PieChart, PieValueType } from '@mui/x-charts';
ChartJS.register(ArcElement, Tooltip, Legend, Title);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Traffic Sources' },
      tooltip: {
        callbacks: {
          // Show percentage alongside the raw value
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((ctx.parsed / total) * 100).toFixed(1);
            return `${ctx.label}: ${ctx.parsed} (${pct}%)`;
          },
        },
      },
    },
  };

export default function MainGrid() {
  const [amountByCategory, setAmountsByCategory] = React.useState<TransactionsGroupedByCategory[]>([]);
  const [pieData, setPieData] = React.useState<any>([])
  const fetchAmountsByCategory = () : void => {
      fetch(getApiUrl(null) + "/Transactions/GetGroupedByCategory?from=2023-03-06T14:30:00Z&to=2026-08-31T14:30:00Z&typeId=1", {
          method: "GET",
     }).then((response: Response) => {
          var res = response.json() as Promise<TransactionsGroupedByCategory[]>;
          res.then((categories) => {
              console.log(categories)
              setAmountsByCategory(categories);
              var pieDataDto : any = []
              categories.forEach(c => {
                  console.log("filling category =>", c);
                  pieDataDto.push({
                    value: c.amount,
                    id: c.id,
                    label: c.category.name
                  })
              });
              console.log(pieDataDto)
              setPieData(pieDataDto);
          });
      });
  };

  React.useEffect(() => {
    fetchAmountsByCategory()
  },[]);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography>Spending chart</Typography>
      <PieChart
        series={[
          {
            data: pieData,
          },
        ]}
        width={200}
        height={200}
      />
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 115 }}>
          <Transaction />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row', lg: 'column' }}
            sx={{ gap: 2 }}
          >
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
