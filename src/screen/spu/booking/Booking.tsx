import {Button} from '@ant-design/react-native';
import React from 'react';
import {ScrollView, View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {Form, FormTitle, SectionGroup, Select} from '../../../component';
import {BoolOptions} from '../../../constants';
import {getBookingType} from '../../../helper';
import {useCodeTypes} from '../../../helper/hooks';
import {BoolEnum} from '../../../models';
import {RootState} from '../../../redux/reducers';
import {styles} from '../style';

interface BookingProps {
  onNext?: () => void;
}

const Booking: React.FC<BookingProps> = ({onNext}) => {
  // const [showAddNotice, setShowAddNotice] = useState(false);
  // const [template, setTemplate] = useState<{type: SKUBuyNoticeType; list: string[]}>({type: 'BOOKING', list: []});
  // const [customNotice, setCustomNotice] = useState<string>('');
  // const [showBinding, setShowBinding] = useState(false); // 显示预约型号
  // const [hasClickedModelLink, setHasClickedModelLink] = useState(false); // 是否点击了预约型号

  const contractDetail = useSelector((state: RootState) => state.contract.currentContract);
  // const merchantDetail = useSelector((state: RootState) => state.merchant.currentMerchant);

  const form = Form.useFormInstance();
  // const [bindingForm] = Form.useForm();

  const [codeTypes] = useCodeTypes();
  // const [buyNotices] = useSKUBuyNotice();
  // const [bookingModal, reloadBookingModal] = useMerchantBookingModel(merchantDetail?.id);
  // const [commonDispatcher] = useCommonDispatcher();

  // const getBuyNoticeTemplate = useCallback(
  //   (type: SKUBuyNoticeType) => {
  //     return buyNotices ? buyNotices[type] : [];
  //   },
  //   [buyNotices],
  // );

  async function onCheck() {
    console.log(form.getFieldsValue());
    onNext && onNext();
  }

  // function openAddNotice(type: SKUBuyNoticeType) {
  //   setShowAddNotice(true);
  //   setTemplate({type, list: getBuyNoticeTemplate(type)});
  //   setCustomNotice('');
  // }

  // function openBindingModal() {
  //   if (!merchantDetail?.id || !contractDetail?.id) {
  //     return commonDispatcher.error('请先选择商家和合同');
  //   }
  //   bindingForm.setFieldsValue({
  //     contractSkuIds: [],
  //   });
  //   setShowBinding(true);
  // }

  // function onAddNotice(type: SKUBuyNoticeType, content: string) {
  //   let fieldName = '';
  //   switch (type) {
  //     case 'BOOKING':
  //       fieldName = '_bookingNotice';
  //       break;
  //     case 'SALE_TIME':
  //       fieldName = '_saleTimeNotice';
  //       break;
  //     case 'USE_RULE':
  //       fieldName = '_useRuleNotice';
  //       break;
  //     case 'TIPS':
  //       fieldName = '_tipsNotice';
  //       break;
  //     case 'POLICY':
  //       fieldName = '_policyNotice';
  //       break;
  //   }
  //   if (fieldName) {
  //     const oldList = form.getFieldValue(fieldName) as string[];
  //     form.setFieldsValue({[fieldName]: [...oldList, content]});
  //   }
  //   setShowAddNotice(false);
  // }

  return (
    <ScrollView style={styles.container}>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="预约设置" />
        <Form.Item label="预约类型">
          <Text>{getBookingType(contractDetail?.bookingReq?.bookingType)}</Text>
        </Form.Item>
        <Form.Item label="可提前几天预约">
          <Text>{contractDetail?.bookingReq?.bookingEarlyDay || '-'}天</Text>
        </Form.Item>
        <Form.Item label="预约开始时间">
          <Text>{contractDetail?.bookingReq?.bookingBeginTime}</Text>
        </Form.Item>
        <Form.Item label="可取消预约">
          <Select disabled value={contractDetail?.bookingReq?.bookingCanCancel} options={BoolOptions} />
        </Form.Item>
        {contractDetail?.bookingReq?.bookingCanCancel === BoolEnum.TRUE && (
          <Form.Item label="需提前几天取消预约">
            <Text>{contractDetail?.bookingReq?.bookingCancelDay || '-'}天</Text>
          </Form.Item>
        )}
      </SectionGroup>
      {/* todo: 绑定预约型号 */}
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="发码设置" />
        <Form.Item label="发码方式">
          <Select disabled value={contractDetail?.bookingReq?.codeType} options={codeTypes.map(item => ({label: item.name, value: item.codeType}))} />
        </Form.Item>
      </SectionGroup>
      {/* todo: 购买须知 */}
      <View style={styles.button}>
        <Button type="primary" onPress={onCheck}>
          下一步
        </Button>
      </View>
    </ScrollView>
  );
};
// Booking.defaultProps = {
// };
export default Booking;
