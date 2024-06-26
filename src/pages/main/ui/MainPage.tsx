import React, {
  FC, memo, useCallback, useEffect, useMemo, useState,
} from 'react';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import { DynamicModuleLoader, ReducersList } from 'shared/lib';
import { useDispatch, useSelector } from 'react-redux';
import { StateSchema } from 'app/providers/StoreProvider';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Currency, currencyActions, currencyReducer, CurrencyType, fetchCurrencyByDate,
} from 'entities/Currency';
import { LangSwitcher } from 'features/LangSwitcher';
import { Input } from 'shared/ui';
import cls from './Main.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface IProps {
  className?: any;
}

const initialReducers: ReducersList = {
  currency: currencyReducer,
};

const colorCurrency = {
  [Currency.EUR]: {
    borderColor: 'rgb(35,69,243)',
    backgroundColor: 'rgba(101,101,229,0.5)',
  },
  [Currency.USD]: {
    borderColor: 'rgb(196,0,88)',
    backgroundColor: 'rgba(246,86,159,0.53)',
  },
  [Currency.CNY]: {
    borderColor: 'rgb(187,37,9)',
    backgroundColor: 'rgb(231,125,107)',
  },
};
const MainPage: FC<IProps> = () => {
  const currentStartDate = new Date(new Date().setDate(new Date().getDate() - 5));
  const thisDate = new Date();
  const { t } = useTranslation();
  const chartData = useSelector((state: StateSchema) => state?.currency?.chartData);
  const currency = useSelector((state: StateSchema) => state?.currency?.currency);
  const dates = useSelector((state: StateSchema) => state?.currency?.datesForm);
  const countFetch = useSelector((state: StateSchema) => state?.currency?.countFetch);
  const [startDate, setStartDate] = useState<Date | null>(currentStartDate);
  const [endDate, setEndDate] = useState<Date | null>(thisDate);
  const dispatch = useDispatch();

  const getDatesBetween = (startDate: Date, endDate: Date) => { // Вычисляем даты от startDate до endDate
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate.toISOString().slice(0, 10) <= endDate.toISOString().slice(0, 10)) {
      dates.push(currentDate.toISOString().slice(0, 10)); // Форматируем дату в YYYY-MM-DD
      const newDate = currentDate.getDate() + 1;
      currentDate.setDate(newDate);
    }

    return dates;
  };

  useEffect(() => { // запрос к API при каждом обновлении данных startDate, endDate, currency
    if (startDate && endDate) {
      const resultDates = getDatesBetween(startDate, endDate);
      if (resultDates) {
        dispatch(currencyActions.setDates(resultDates));
        dispatch(currencyActions.setDatesForm(resultDates));
        currency?.forEach((currencyItem) => {
          dispatch(fetchCurrencyByDate({
            currency: currencyItem,
          }));
        });
      }
    }
  }, [startDate, endDate, currency]);

  // селект валют
  const setCurrency = useCallback((currencyItem: CurrencyType) => {
    if (currency?.some((item) => item === currencyItem)) {
      dispatch(currencyActions.removeCurrency(currencyItem));
    } else {
      dispatch(currencyActions.setCurrency(currencyItem));
    }
  }, [currency, currencyActions, dispatch, fetchCurrencyByDate, fetch]);

  const data = useMemo(() => (
    {
      labels: dates,
      datasets: currency?.map((value) => (
        {
          label: value,
          data: dates?.map((date) => chartData?.get(value)?.find((item) => item?.date === date)?.value),
          borderColor: colorCurrency[value].borderColor,
          backgroundColor: colorCurrency[value].backgroundColor,
        }
      )) || [
        {
          label: '',
          data: [],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    }
  ), [dates, currency, chartData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      customCanvasBackgroundColor: {
        color: 'lightGreen',
      },
      title: {
        display: true,
        text: t('Графиков курса валют по отношению к рублю'),
      },
    },
  };

  const translateLabel: Record<CurrencyType, string> = {
    [Currency.EUR]: t('Евро'),
    [Currency.CNY]: t('Юань'),
    [Currency.USD]: t('Доллар'),
  };

  return (
    <DynamicModuleLoader
      removeAfterUnmount
      reducers={initialReducers}
    >
      <div className={cls.container}>
        <div className={cls.wrapActions}>
          <div>
            <Input label={translateLabel[Currency.EUR]} type="checkbox" onClick={() => setCurrency(Currency.EUR)} />
            <Input label={translateLabel[Currency.CNY]} type="checkbox" onClick={() => setCurrency(Currency.CNY)} />
            <Input label={translateLabel[Currency.USD]} type="checkbox" onClick={() => setCurrency(Currency.USD)} />
          </div>
          <div className={cls.wrapDatePicker}>
            <label htmlFor="to">{t('Дата с')}</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(() => date)}
              selectsStart
              startDate={startDate}
              className={cls.datePicker}
              endDate={endDate}
              id="to"
              maxDate={endDate}
              dateFormat="MM/yyyy/dd"
            />

            <label htmlFor="from">{t('Дата по')}</label>
            <DatePicker
              id="from"
              className={cls.datePicker}
              selected={endDate}
              onChange={(date) => setEndDate(() => date)}
              selectsEnd
              minDate={startDate}
              startDate={startDate}
              maxDate={thisDate}
              endDate={endDate}
              dateFormat="MM/yyyy/dd"
            />
          </div>
          <div>
            {t('Запросы')}
            :
            {countFetch}
          </div>
          <LangSwitcher />
        </div>

        <div className={cls.wrapLine}>
          <Line
            redraw
            style={{ flex: '1 !important', height: 400 }}
            options={options}
            data={data}
            updateMode="none"
          />
        </div>

      </div>
    </DynamicModuleLoader>
  );
};

export default memo(MainPage);
