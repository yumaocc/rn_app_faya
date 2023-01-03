import {FC, useCallback, useEffect, useState} from 'react';
import * as api from '../../../../apis';
import React from 'react';
import {Modal} from '../../../../component';
import FlatTree from '../../../../component/FlatTree';

// import './index.scss';

interface SelectSiteModalProps {
  visible: boolean;
  selectedKeys: number[];
  onClose?: () => void;
  onOk?: (keys: number[]) => void;
}

const SelectSiteModal: FC<SelectSiteModalProps> = props => {
  const {visible} = props;
  const [sites, setSites] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState<number[]>(props.selectedKeys);

  const syncKeys = useCallback(() => {
    setSelectedKeys(props.selectedKeys);
  }, [props.selectedKeys]);

  useEffect(() => {
    if (visible) {
      // 每次打开弹窗时，同步选中的keys
      syncKeys();
    }
  }, [syncKeys, visible]);

  function handleClose() {
    props.onClose && props.onClose();
  }
  function handleOk() {
    props.onOk && props.onOk(selectedKeys);
  }
  function handleChangeSelect(keys: number[]) {
    setSelectedKeys(keys);
  }

  useEffect(() => {
    api.common.getSites().then(res => {
      setSites(res);
    });
  }, []);
  return (
    <Modal title="请选择上线站点" visible={props.visible} onClose={handleClose} onOk={handleOk}>
      <FlatTree fieldNames={{title: 'name', key: 'id'}} treeData={sites} selectedKeys={selectedKeys} onChange={handleChangeSelect} />
    </Modal>
  );
};

SelectSiteModal.defaultProps = {
  visible: false,
};

export default SelectSiteModal;
