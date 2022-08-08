import React, {useCallback, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {SectionGroup, FormTitle, Form, PlusButton, Modal} from '../../../component';
import {SwipeAction, TextareaItem} from '@ant-design/react-native';
import {useSKUBuyNotice} from '../../../helper/hooks';
import {SKUBuyNoticeType} from '../../../models';
import {styles} from '../style';
import {globalStyleVariables} from '../../../constants/styles';
import {getBuyNoticeTitle} from '../../../helper';

interface BuyNoticeProps {
  title?: string;
}

const BuyNotice: React.FC<BuyNoticeProps> = () => {
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [customNotice, setCustomNotice] = useState<string>('');
  const [template, setTemplate] = useState<{type: SKUBuyNoticeType; list: string[]}>({type: 'BOOKING', list: []});
  const [buyNotices] = useSKUBuyNotice();
  const form = Form.useFormInstance();

  const getBuyNoticeTemplate = useCallback(
    (type: SKUBuyNoticeType) => {
      return buyNotices ? buyNotices[type] : [];
    },
    [buyNotices],
  );
  const getNoticeList = useCallback<(k: string) => string[]>((fieldKey: string) => form.getFieldValue(fieldKey) || [], [form]);

  function openAddNotice(type: SKUBuyNoticeType) {
    setShowAddNotice(true);
    setTemplate({type, list: getBuyNoticeTemplate(type)});
    setCustomNotice('');
  }

  function removeNotice(type: SKUBuyNoticeType, index: number) {
    const fieldKey = getFieldKeyByType(type);
    const list = getNoticeList(fieldKey);
    // list.splice(index, 1);
    form.setFieldsValue({[fieldKey]: list.filter((_, i) => i !== index)});
  }

  function getFieldKeyByType(type: SKUBuyNoticeType): string {
    switch (type) {
      case 'BOOKING':
        return '_bookingNotice';
      case 'SALE_TIME':
        return '_saleTimeNotice';
      case 'USE_RULE':
        return '_useRuleNotice';
      case 'TIPS':
        return '_tipsNotice';
      case 'POLICY':
        return '_policyNotice';
      default:
        return '';
    }
  }

  function onAddNotice(type: SKUBuyNoticeType, content: string) {
    let fieldName = getFieldKeyByType(type);
    if (fieldName) {
      const oldList = form.getFieldValue(fieldName) as string[];
      form.setFieldsValue({[fieldName]: [...oldList, content]});
    }
    setShowAddNotice(false);
  }

  function renderNoticeByType(type: SKUBuyNoticeType) {
    const title = getBuyNoticeTitle(type);
    const fieldKey = getFieldKeyByType(type);
    const notices = getNoticeList(fieldKey);
    const hasNotices = notices && notices.length > 0;
    return (
      <Form.Item
        label={title}
        extra={
          hasNotices ? (
            <View style={{backgroundColor: '#f2f2f2', borderRadius: 5, padding: 10}}>
              {notices.map((item, index) => {
                return (
                  <SwipeAction
                    key={index}
                    right={[
                      {
                        text: '删除',
                        color: 'white',
                        backgroundColor: globalStyleVariables.COLOR_DANGER,
                        onPress: () => removeNotice(type, index),
                      },
                    ]}>
                    <View style={{paddingVertical: 10}}>
                      <Text numberOfLines={4}>{item}</Text>
                    </View>
                  </SwipeAction>
                );
              })}
            </View>
          ) : null
        }>
        <PlusButton title="新建一条" onPress={() => openAddNotice(type)} />
      </Form.Item>
    );
  }
  return (
    <>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="购买须知设置" />
        {renderNoticeByType('BOOKING')}
        {renderNoticeByType('SALE_TIME')}
        {renderNoticeByType('USE_RULE')}
        {renderNoticeByType('POLICY')}
        {renderNoticeByType('TIPS')}
      </SectionGroup>

      <Modal
        visible={showAddNotice}
        onClose={() => setShowAddNotice(false)}
        onOk={() => {
          onAddNotice(template.type, customNotice);
        }}>
        <View>
          {template?.list?.length > 0 && (
            <>
              <View style={{marginBottom: 10}}>
                <Text style={{fontSize: 16}}>选择一个模板</Text>
              </View>
              {template.list.map((text, index) => (
                <TouchableOpacity key={index} activeOpacity={0.5} onPress={() => onAddNotice(template.type, text)}>
                  <View style={styles.buyNoticeTemplate}>
                    <Text style={styles.templateText}>{text}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
          {template?.list?.length > 0 && (
            <View style={{marginTop: 20, marginBottom: 10}}>
              <Text style={{fontSize: 16}}>或者用以下内容新增</Text>
            </View>
          )}
          <View style={{borderWidth: 1, borderRadius: 5, borderColor: globalStyleVariables.BORDER_COLOR, overflow: 'hidden', padding: 5}}>
            <TextareaItem last style={{fontSize: 15}} value={customNotice} onChange={value => setCustomNotice(value)} rows={3} placeholder="请输入自定义内容" />
          </View>
        </View>
      </Modal>
    </>
  );
};
// BuyNotice.defaultProps = {
//   title: 'BuyNotice',
// };
export default BuyNotice;
