import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {SwipeAction, TextareaItem} from '@ant-design/react-native';
import {SectionGroup, FormTitle, Form, PlusButton, Modal} from '../../../../component';
import {useSKUBuyNotice} from '../../../../helper/hooks';
import {Notice, NoticeItem, SKUBuyNoticeType} from '../../../../models';
import {styles} from '../style';
import {globalStyles, globalStyleVariables} from '../../../../constants/styles';
import {Control, Controller, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {cleanNotice} from '../../../../helper/util';

interface BuyNoticeProps {
  title?: string;
  control?: Control<any, any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  watch?: UseFormWatch<any>;
}

interface BookingNoticeProps {
  value: Notice;
}

const BuyNotice: React.FC<BuyNoticeProps> = ({setValue, control, getValues}) => {
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [customNotice, setCustomNotice] = useState<string>('');
  const [buyNotices] = useSKUBuyNotice();
  const [currentTemplate, setCurrentTemplate] = useState<SKUBuyNoticeType>();
  function openAddNotice(type: SKUBuyNoticeType) {
    setShowAddNotice(true);
    setCurrentTemplate(type);
  }

  function removeNotice(type: SKUBuyNoticeType, index: number) {
    const {purchaseNoticeEntities} = getValues();
    const needDelNotice = purchaseNoticeEntities.filter((item: any) => item.type === type);
    const newNotice = needDelNotice.filter((item: NoticeItem, idx: number) => idx !== index);
    const oldNotice = purchaseNoticeEntities.filter((item: any) => item.type !== type);

    setValue('purchaseNoticeEntities', [...oldNotice, ...newNotice]);
  }

  function onAddNotice(type: SKUBuyNoticeType, content: string) {
    const {purchaseNoticeEntities = []} = getValues();

    setValue('purchaseNoticeEntities', [...purchaseNoticeEntities, {type: type, content}]);
    setShowAddNotice(false);
    setCustomNotice('');
  }

  const BookingNotice: React.FC<BookingNoticeProps> = props => {
    const {value} = props;
    const noticeContent = (type: SKUBuyNoticeType) => {
      return (
        <>
          {value?.[type]?.map((item, index) => (
            <View key={index} style={[style.noticeBox]}>
              <SwipeAction
                key={index}
                right={[
                  {
                    text: '??????',
                    color: 'white',
                    backgroundColor: globalStyleVariables.COLOR_DANGER,
                    onPress: () => removeNotice(item.type, index),
                  },
                ]}>
                <View style={{paddingVertical: 10}}>
                  <Text style={globalStyles.fontPrimary} numberOfLines={4}>
                    {item.content}
                  </Text>
                </View>
              </SwipeAction>
            </View>
          ))}
        </>
      );
    };
    return (
      <>
        <SectionGroup style={styles.sectionGroupStyle}>
          <FormTitle title="??????????????????" borderTop />

          <Form.Item label="????????????">
            <PlusButton title="????????????" onPress={() => openAddNotice('BOOKING')} />
          </Form.Item>
          {noticeContent('BOOKING')}

          <Form.Item label="????????????">
            <PlusButton title="????????????" onPress={() => openAddNotice('SALE_TIME')} />
          </Form.Item>
          {noticeContent('SALE_TIME')}

          <Form.Item label="????????????">
            <PlusButton title="????????????" onPress={() => openAddNotice('USE_RULE')} />
          </Form.Item>
          {noticeContent('USE_RULE')}

          <Form.Item label="????????????">
            <PlusButton title="????????????" onPress={() => openAddNotice('TIPS')} />
          </Form.Item>
          {noticeContent('TIPS')}

          <Form.Item label="????????????">
            <PlusButton title="????????????" onPress={() => openAddNotice('POLICY')} />
          </Form.Item>
          {noticeContent('POLICY')}
        </SectionGroup>
      </>
    );
  };
  return (
    <>
      <Controller name="purchaseNoticeEntities" control={control} render={({field: {value}}) => <BookingNotice value={cleanNotice(value)} />} />

      <Modal
        visible={showAddNotice}
        onClose={() => setShowAddNotice(false)}
        onOk={() => {
          if (customNotice !== '') {
            onAddNotice(currentTemplate, customNotice);
          }
        }}>
        <View>
          {buyNotices[currentTemplate]?.length > 0 && (
            <>
              <View style={{marginBottom: 10}}>
                <Text style={{fontSize: 16}}>??????????????????</Text>
              </View>
              {buyNotices[currentTemplate].map((item, index) => (
                <TouchableOpacity key={index} activeOpacity={0.5} onPress={() => onAddNotice(item.type, item.content)}>
                  <View style={styles.buyNoticeTemplate}>
                    <Text style={styles.templateText}>{item.content}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          <View style={{marginTop: 20, marginBottom: 10}}>
            <Text style={{fontSize: 16}}>???????????????????????????</Text>
          </View>

          <View style={{borderWidth: 1, borderRadius: 5, borderColor: globalStyleVariables.BORDER_COLOR, overflow: 'hidden', padding: 5}}>
            <TextareaItem last style={{fontSize: 15}} value={customNotice} onChange={value => setCustomNotice(value)} rows={3} placeholder="????????????????????????" />
          </View>
        </View>
      </Modal>
    </>
  );
};
BuyNotice.defaultProps = {
  title: 'BuyNotice',
};
export default BuyNotice;

const style = StyleSheet.create({
  noticeBox: {
    padding: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
    marginBottom: globalStyleVariables.MODULE_SPACE,
  },
});
