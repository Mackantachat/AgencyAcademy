import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export default [
  {
    id: '932d6ab5-725f-4149-b974-5839683af6fa',
    order_number: '2208180001',
    order_items: [
      {
        title: 'ค่าพักบัตรเติมเงิน',
        amount: 50
      }
    ],
    order_date: dayjs('08-18-2022 13:23:15', 'MM-DD-YYYY HH:mm:ss').format(),
    paid_date: null,
    order_status: 'pending',
    receipt_number: null,
    total: 50
  },
  {
    id: '6de905cc-297c-48a6-8dff-66318cb3f945',
    order_number: '2208171999',
    order_items: [
      {
        title: 'ค่าคู่มือประกอบการอบรมขอรับใบอนุญาต',
        amount: 100
      }
    ],
    order_date: dayjs('08-17-2022 20:10:15', 'MM-DD-YYYY HH:mm:ss').format(),
    paid_date: null,
    order_status: 'pending',
    receipt_number: null,
    total: 100
  },
  {
    id: '30295caa-0314-4ab2-9780-cf1dab32d975',
    order_number: '2208170076',
    order_items: [
      {
        title: 'ค่าคู่มือประกอบการอบรมขอรับใบอนุญาต',
        amount: 100
      },
      {
        title: 'ค่าพักบัตรเติมเงิน',
        amount: 50
      }
    ],
    order_date: dayjs('08-17-2022 10:13:15', 'MM-DD-YYYY HH:mm:ss').format(),
    paid_date: null,
    order_status: 'pending',
    receipt_number: null,
    total: 150
  },
  {
    id: '0470d3ec-70d1-4776-8fcf-87de6b363002',
    order_number: '2206010398',
    order_items: [
      {
        title: 'หลักสูตรอบรมสอบใบอนุญาตเป็นตัวแทน ประกันชีวิต (E-A)',
        amount: 1500
      }
    ],
    order_date: dayjs('06-01-2022 08:40:14', 'MM-DD-YYYY HH:mm:ss').format(),
    paid_date: null,
    order_status: 'pending',
    receipt_number: null,
    total: 1500
  },
  {
    id: '824221c5-b867-45ab-bceb-12da63558632',
    order_number: '2208180001',
    order_items: [
      {
        title: 'ค่าพักบัตรเติมเงิน',
        amount: 50
      }
    ],
    order_date: dayjs('09-18-2022 19:40:14', 'MM-DD-YYYY HH:mm:ss').format(),
    paid_date: dayjs('06-01-2022 19:56:21', 'MM-DD-YYYY HH:mm:ss').format(),
    order_status: 'paid',
    receipt_number: 'R2208180001',
    total: 50
  },
  {
    id: '0ea2cd01-f7fd-4ea8-a4cb-8757fe1aecf5',
    order_number: '2208171999',
    order_items: [
      {
        title: 'ค่าคู่มือประกอบการอบรมขอรับใบอนุญาต',
        amount: 100
      }
    ],
    order_date: dayjs('08-14-2022 11:30:14', 'MM-DD-YYYY HH:mm:ss').format(),
    paid_date: dayjs('08-14-2022 11:58:21', 'MM-DD-YYYY HH:mm:ss').format(),
    order_status: 'paid',
    receipt_number: 'R2208180002',
    total: 100
  },
  {
    id: '0ea2aab625ba-4085-4563-a64b-cbfedd429a4e',
    order_number: '2208170076',
    order_items: [
      {
        title: 'ค่าคู่มือประกอบการอบรมขอรับใบอนุญาต',
        amount: 100
      },
      {
        title: 'ค่าพักบัตรเติมเงิน',
        amount: 50
      }
    ],
    order_date: dayjs('06-01-2022 08:40:14', 'MM-DD-YYYY HH:mm:ss').format(),
    paid_date: dayjs('06-01-2022 08:43:21', 'MM-DD-YYYY HH:mm:ss').format(),
    order_status: 'paid',
    receipt_number: 'R2208180003',
    total: 150
  }
]
