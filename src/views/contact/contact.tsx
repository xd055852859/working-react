import React, { useState, useEffect, useRef } from 'react';
import './contact.css';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { setMessage } from '../../redux/actions/commonActions';
import { getMember } from '../../redux/actions/memberActions';
import {
  getGroup,
  setGroupKey,
  getGroupInfo,
} from '../../redux/actions/groupActions';
import {
  setCommonHeaderIndex,
  setMoveState,
  setChatState,
  setShowChatState,
} from '../../redux/actions/commonActions';
import {
  // setTargetUserKey,
  getTargetUserInfo,
  setClickType,
  // userKeyToGroupKey
} from '../../redux/actions/authActions';
import { Breadcrumbs, Link, Typography } from '@material-ui/core';
import {
  setHeaderIndex,
  changeCompanyItem,
} from '../../redux/actions/memberActions';
import Dialog from '../../components/common/dialog';
import { Tree } from 'tree-graph-react';
import Avatar from '../../components/common/avatar';
import TimeIcon from '../../components/common/timeIcon';
import Loading from '../../components/common/loading';
import checkPersonPng from '../../assets/img/checkPerson.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import defaultPersonSvg from '../../assets/svg/defaultPerson.svg';

import defaultGroupPng from '../../assets/img/defaultGroup.png';
import carePng from '../../assets/img/care.png';
import chatSvg from '../../assets/svg/chat.svg';
import uncarePng from '../../assets/img/uncare.png';
import unUseSvg from '../../assets/svg/unUse.svg';
import contactTree from '../../assets/svg/contactTree.svg';
import contactBook from '../../assets/svg/contactBook.svg';
import computer from '../../assets/svg/computer.svg';
import { Search, NavigateNext } from '@material-ui/icons';
import api from '../../services/api';
import _ from 'lodash';
export interface ContactProps {
  contactIndex: number;
  contactType?: string;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '700px',
      overflow: 'auto',
    },
    item: {
      width: '100%',
      height: '63px',
    },
    title: {
      fontSize: '14px',
    },
  })
);
const Contact: React.FC<ContactProps> = (props) => {
  // const classes = useStyles();
  const { contactIndex, contactType } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const companyMemberArray = useTypedSelector(
    (state) => state.member.companyMemberArray
  );
  const companyItem = useTypedSelector((state) => state.member.companyItem);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const chatState = useTypedSelector((state) => state.common.chatState);
  const showChatState = useTypedSelector((state) => state.common.showChatState);
  const [contactArray, setContactArray] = useState<any>([]);
  const [FoldArray, setFoldArray] = useState<any>([]);
  const [contactKey, setContactKey] = useState<any>(null);
  const [contactSearchInput, setContactSearchInput] = useState('');
  const [cloneGroupKey, setCloneGroupKey] = useState('');
  const [cloneGroupName, setCloneGroupName] = useState('');
  const [cloneGroupVisible, setCloneGroupVisible] = useState(false);
  const [cloneGroupIndex, setCloneGroupIndex] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [startId, setStartId] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [selectedPath, setSelectedPath] = useState<any>([]);
  const [targetNode, setTargetNode] = useState<any>(null);
  const theme = useTypedSelector((state) => state.auth.theme);
  let chatRef = useRef<any>(null);
  let unDistory = true;
  // const theme = useTypedSelector((state) => state.auth.theme)
  useEffect(() => {
    return () => {
      unDistory = false;
      if (chatRef.current) {
        clearInterval(chatRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (user) {
      if (contactIndex === 0) {
        // if (groupArray) {
        //   setLoading(false);
        //   setContactArray(groupArray);
        // } else {
        setLoading(true);
        dispatch(getGroup(3));
        if (!groupArray) {
          dispatch(getMember(mainGroupKey));
        }
        // }
      } else if (contactIndex === 1) {
        setLoading(true);
        dispatch(getMember(mainGroupKey));
      }
    }
  }, [user, contactIndex]);
  useEffect(() => {
    if (contactIndex === 3) {
      setLoading(true);
      getGroupTree(companyItem.config.startId);
    }
  }, [companyItem, contactIndex]);
  useEffect(() => {
    if (groupArray && contactIndex === 0) {
      setLoading(false);
      let newGroupArray: any = null;
      if (mainEnterpriseGroup && mainEnterpriseGroup.mainEnterpriseGroupKey) {
        newGroupArray = groupArray.filter((item: any) => {
          if (
            item.enterpriseGroupKey ===
            mainEnterpriseGroup.mainEnterpriseGroupKey ||
            item._key === mainEnterpriseGroup.mainEnterpriseGroupKey
          ) {
            return item;
          }
        });
      } else {
        newGroupArray = groupArray;
      }
      console.log(newGroupArray);
      setContactArray(newGroupArray);
    }
  }, [groupArray, contactIndex, mainEnterpriseGroup]);

  useEffect(() => {
    if (memberArray && contactIndex === 1) {
      setLoading(false);
      setContactArray(memberArray);
    }
  }, [memberArray, contactIndex]);
  useEffect(() => {
    if (companyMemberArray && contactIndex === 2) {
      setContactArray(companyMemberArray);
    }
  }, [companyMemberArray, contactIndex]);
  useEffect(() => {
    if (contactSearchInput === '') {
      if (groupArray && contactIndex === 0) {
        setContactArray(groupArray);
      } else if (memberArray && contactIndex === 1) {
        setContactArray(memberArray);
      }
    }
  }, [contactSearchInput]);

  useEffect(() => {
    if (chatState && contactKey) {
      chatRef.current = setTimeout(goChat, 2000);
    }
    // dispatch(setChatState(false));
  }, [showChatState]);

  useEffect(() => {
    if (contactKey) {
      goChat();
    }
    // dispatch(setChatState(false));
  }, [contactKey]);
  useEffect(() => {
    if (startId && companyData && companyData[startId]) {
      setSelectedPath(companyData[startId].path);
    }
  }, [startId, companyData]);
  const toTargetGroup = async (groupKey: string) => {
    dispatch(setGroupKey(groupKey));
    // dispatch(getGroupInfo(groupKey));
    dispatch(setCommonHeaderIndex(3));
    if (!theme.moveState) {
      dispatch(setMoveState('in'));
    }
    await api.group.visitGroupOrFriend(2, groupKey);
    // if (contactType === 'header') {
    dispatch(getGroup(3));
    // }
  };
  const toTargetUser = async (targetUserKey: string) => {
    if (targetUserKey !== user._key) {
      dispatch(getTargetUserInfo(targetUserKey));
      dispatch(setCommonHeaderIndex(2));
    } else {
      dispatch(setCommonHeaderIndex(1));
      setClickType('self');
    }

    if (!theme.moveState) {
      dispatch(setMoveState('in'));
    }
    await api.group.visitGroupOrFriend(1, targetUserKey);
    if (contactType === 'header') {
      dispatch(getMember(mainGroupKey));
    }
    //
  };
  const changeCare = (
    e: any,
    type: number,
    key: string,
    status: number,
    index: number
  ) => {
    e.stopPropagation();
    let newContactArray: any = _.cloneDeep(contactArray);
    api.auth.dealCareFriendOrGroup(type, key, status);
    newContactArray[index].isCare = status === 1 ? true : false;
    setContactArray(newContactArray);
  };
  const changeUse = (e: any, key: string, status: number, index: number) => {
    e.stopPropagation();
    let newContactArray: any = _.cloneDeep(contactArray);
    api.auth.dealGroupFold(key, status);
    newContactArray[index].isFold = true;
    setContactArray(newContactArray);
  };
  const searchGroup = (input?: string) => {
    let newContactArray = _.cloneDeep(groupArray);
    let searchInput = input ? input : contactSearchInput;
    newContactArray = newContactArray.filter((item: any, index: number) => {
      return (
        item.groupName &&
        item.groupName.toUpperCase().indexOf(searchInput.toUpperCase()) !== -1
      );
    });
    setContactArray(newContactArray);
  };
  const cloneGroup = async () => {
    let cloneRes: any = await api.group.cloneGroup(
      cloneGroupKey,
      cloneGroupName + '_副本'
    );
    if (cloneRes.msg === 'OK') {
      dispatch(setMessage(true, '克隆群成功', 'success'));
      dispatch(setGroupKey(cloneRes.result));
      dispatch(getGroupInfo(cloneRes.result));
      dispatch(setCommonHeaderIndex(3));
      if (!theme.moveState) {
        dispatch(setMoveState('in'));
      }
      await api.group.visitGroupOrFriend(2, cloneRes.result);
      dispatch(getGroup(3));
    } else {
      dispatch(setMessage(true, cloneRes.msg, 'error'));
    }
  };
  const goChat = async () => {
    const dom: any = document.querySelector('#chat');
    if (dom) {
      if (contactIndex) {
        const privatePerson =
          memberArray[_.findIndex(memberArray, { userId: contactKey })];
        if (privatePerson) {
          const privateChatRId = privatePerson.privateChatRId;
          if (privateChatRId) {
            dom.contentWindow.postMessage(
              {
                externalCommand: 'go',
                path: '/direct/' + privateChatRId,
              },
              '*'
            );
          } else {
            let chatRes: any = await api.member.getPrivateChatRId(
              mainGroupKey,
              contactKey
            );

            if (chatRes.msg === 'OK') {
              dom.contentWindow.postMessage(
                {
                  externalCommand: 'go',
                  path: '/direct/' + chatRes.result,
                },
                '*'
              );
            } else {
              dispatch(setMessage(true, chatRes.msg, 'error'));
            }
          }
        }
      } else {
        dom.contentWindow.postMessage(
          {
            externalCommand: 'go',
            path: '/group/' + contactKey,
          },
          '*'
        );
      }
    }
  };
  const getGroupTree = async (nodeId: any) => {
    if (mainEnterpriseGroup && mainEnterpriseGroup.mainEnterpriseGroupKey) {
      let newCompanyData: any = {};
      let companyDepartmentRes: any = await api.company.getOrganizationTree(
        mainEnterpriseGroup.mainEnterpriseGroupKey,
        4
      );
      setLoading(false);
      if (unDistory) {
        if (companyDepartmentRes.msg === 'OK') {
          let data = companyDepartmentRes.result;
          for (let key in data) {
            newCompanyData[key] = {
              _key: data[key]._key,
              contract: false,
              father: data[key].parentOrgKey,
              name: data[key].name,
              // data[key].orgType === 1
              //   ? data[key].name
              //   : data[key].name +
              //     ' (' +
              //     (data[key].post ? data[key].post : '无职务') +
              //     ' )',
              path: data[key].path1,
              sortList: data[key].children,
              enterpriseGroupKey: data[key].enterpriseGroupKey,
              groupMemberKey: data[key].groupMemberKey,
              orgType: data[key].orgType,
              staffKey: data[key].staffKey,
              color: data[key].orgType === 2 ? '#fff' : '#333',
              backgroundColor: data[key].orgType === 2 ? 'transparent' : '#fff',
              // disabled: data[key].orgType === 2,
              childrenAll: data[key].childrenAll,
            };
            if (data[key].orgType === 2) {
              //?imageMogr2/auto-orient/thumbnail/80x
              newCompanyData[key].icon = data[key].avatar
                ? data[key].avatar + '?roundPic/radius/!50p'
                : defaultPersonSvg;
            }
            if (!nodeId && !data[key].parentOrgKey) {
              nodeId = data[key]._key;
              newCompanyData[
                key
              ].icon = mainEnterpriseGroup.mainEnterpriseGroupLogo
                  ? mainEnterpriseGroup.mainEnterpriseGroupLogo +
                  '?imageMogr2/auto-orient/thumbnail/80x'
                  : defaultGroupPng;
            }
          }
          setStartId(nodeId);
          setSelectedId(nodeId);
          setCompanyData(newCompanyData);
        } else {
          dispatch(setMessage(true, companyDepartmentRes.msg, 'error'));
        }
      }
    }
  };
  const clickDot = (node: any) => {
    // targetTreeRef.current.closeOptions();
    let newCompanyItem = _.cloneDeep(companyItem);
    setStartId(node._key);
    setSelectedPath(node.path);
    newCompanyItem.config.startId = node._key;
    getGroupTree(node._key);
    api.member.setConfig(newCompanyItem.groupMemberKey, newCompanyItem.config);
    dispatch(changeCompanyItem(newCompanyItem));
    // setSelectedPath(nodeObj[node._key].path1);
  };
  const editContract = (node: any) => {
    let newTargetNode = _.cloneDeep(targetNode);
    let newCompanyData = _.cloneDeep(companyData);
    newTargetNode.contract = newTargetNode.contract ? false : true;
    newCompanyData[node._key].contract = !newCompanyData[node._key].contract;
    setTargetNode(newTargetNode);
    setCompanyData(newCompanyData);
    // setGridList(newGridList);
  };
  return (
    <div
      className="contact"
      style={{ height: contactType ? '100%' : 'calc(100% - 40px)', position: contactIndex === 3 ? 'relative' : 'static' }}
    >
      {loading ? <Loading loadingWidth="70px" loadingHeight="70px" /> : null}
      {contactType && contactIndex === 0 ? (
        <div className="contact-search">
          <Search />
          <input
            type="text"
            value={contactSearchInput}
            onChange={(e: any) => {
              setContactSearchInput(e.target.value);
              searchGroup(e.target.value);
            }}
            className="contact-search-input"
            placeholder="请输入群名"
            onKeyDown={(e: any) => {
              if (e.keyCode === 13) {
                searchGroup();
              }
            }}
          />
          {/* <Button
            variant="contained"
            color="primary"
            onClick={() => {
              searchGroup();
            }}
            className="contact-search-button"
          >
            搜索
          </Button> */}
        </div>
      ) : null}
      {contactIndex !== 3 ? (
        contactArray && contactArray.length > 0 ? (
          contactArray.map((item: any, index: number) => {
            let name = contactIndex ? item.nickName : item.groupName;
            let avatar = contactIndex
              ? item.avatar
                ? item.avatar + '?imageMogr2/auto-orient/thumbnail/80x'
                : ''
              : item.groupLogo
                ? item.groupLogo + '?imageMogr2/auto-orient/thumbnail/80x'
                : defaultGroupPng;
            let key = contactIndex ? item.userId : item._key;
            let onlineColor =
              item.onlineStatus === 'online'
                ? '#7ED321'
                : item.onlineStatus === 'busy'
                  ? '#EA3836'
                  : item.onlineStatus === 'away'
                    ? '#F5A623'
                    : '#B3B3B3';
            return (
              <div
                className="contact-item"
                key={'contact' + index}
                onClick={() => {
                  if (contactType === 'create') {
                    setCloneGroupKey(key);
                    setCloneGroupName(name);
                    setCloneGroupIndex(index);
                    setCloneGroupVisible(true);
                    // ;
                  } else {
                    contactIndex ? toTargetUser(key) : toTargetGroup(key);
                  }
                }}
                style={
                  cloneGroupIndex === index
                    ? { backgroundColor: '#f0f0f0' }
                    : {}
                }
              >
                <div className="contact-left">
                  <div
                    className="contact-avatar"
                    style={{ borderRadius: contactIndex ? '50%' : '5px' }}
                  >
                    <img
                      alt={name}
                      src={avatar ? avatar : defaultPersonPng}
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = defaultPersonPng;
                      }}
                    />
                  </div>
                  {contactIndex ? (
                    <div
                      className="contact-online"
                      style={{ backgroundColor: onlineColor }}
                    ></div>
                  ) : null}
                  <div
                    className="contact-left-title"
                    style={
                      contactType ? { maxWidth: '90%' } : { maxWidth: '65%' }
                    }
                  >
                    {name}
                  </div>
                  {!contactType ? (
                    item.isCare ? (
                      <img
                        src={carePng}
                        alt=""
                        className="contact-care-img"
                        onClick={(e) => {
                          changeCare(
                            e,
                            contactIndex === 0 ? 2 : 1,
                            key,
                            2,
                            index
                          );
                        }}
                      />
                    ) : (
                        <img
                          src={uncarePng}
                          alt=""
                          className="contact-uncare-img"
                          onClick={(e) => {
                            changeCare(
                              e,
                              contactIndex === 0 ? 2 : 1,
                              key,
                              1,
                              index
                            );
                          }}
                        />
                      )
                  ) : null}
                  {!contactType && !item.notActive ? (
                    <img
                      src={chatSvg}
                      alt=""
                      className="contact-uncare-img"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        // dispatch(setChatState(true))
                        // dispatch(setShowChatState(true));
                        dispatch(setShowChatState(true));
                        dispatch(setChatState(true));
                        setContactKey(contactIndex ? key : item.groupUUID);
                      }}
                    />
                  ) : null}
                  {/* {!contactType && !contactIndex ? (
                    <img
                      src={unUseSvg}
                      alt=""
                      className="contact-uncare-img"
                      onClick={(e: any) => {
                        changeUse(e, key, 1, index);
                      }}
                    />
                  ) : null} */}
                </div>
                <div className="contact-icon-right">
                  {contactType === 'create' && cloneGroupIndex === index ? (
                    <img
                      src={checkPersonPng}
                      alt=""
                      style={{
                        width: '20px',
                        height: '12px',
                      }}
                    ></img>
                  ) : null}
                  {!contactType && item.knowledgeBaseNodeKey ? (
                    <img
                      src={contactBook}
                      alt=""
                      style={{
                        width: '14px',
                        height: '17px',
                        marginRight: '5px',
                      }}
                      onClick={() => {
                        dispatch(setHeaderIndex(9));
                      }}
                    ></img>
                  ) : null}
                  {!contactType && item.isHasKnowledge ? (
                    <img
                      src={contactTree}
                      alt=""
                      className="contact-uncare-img"
                      style={{
                        width: '18px',
                        height: '17px',
                        marginRight: '5px',
                      }}
                      onClick={() => {
                        dispatch(setHeaderIndex(11));
                      }}
                    ></img>
                  ) : null}
                  {item.onlineStatus === 'online' && !contactType ? (
                    <img
                      src={computer}
                      alt=""
                      style={{
                        width: '20px',
                        height: '17px',
                        marginRight: '5px',
                      }}
                    ></img>
                  ) : null}
                  {/* {item.todayTotalTaskNumber && !contactType ? (
                    <TimeIcon
                      timeHour={Math.ceil(item.todayTotalTaskHours)}
                      timeDay={Math.ceil(item.todayTotalTaskNumber)}
                    />
                  ) : (
                    <div style={{ width: '24px' }}></div>
                  )} */}
                </div>
              </div>
            )
          })
        ) : null
      ) : companyData && startId ? (
        <div style={{ marginTop: '40px' }}>
          <Tree
            // disabled
            itemHeight={32}
            blockHeight={25}
            singleColumn={true}
            nodes={companyData}
            uncontrolled={false}
            showIcon={true}
            showMoreButton
            startId={startId}
            // selectedBackgroundColor="#E3E3E3"
            defaultSelectedId={selectedId}
            handleClickNode={(node: any) => {
              console.log(node);
              setTargetNode(node);
              if (node.orgType === 2) {
                toTargetUser(node.staffKey);
              }
            }}
            handleClickDot={
              clickDot
              // setSelectedId(node._key);
            }
            handleClickExpand={editContract}
          // itemHeight={32}
          // blockHeight={
          //   departmentRef.current ? departmentRef.current.offsetHeight : 0
          // }
          />
        </div>
      ) : null}
      <React.Fragment>
        {selectedPath && contactIndex === 3 ? (
          <div className="contact-tree-path">
            <Breadcrumbs
              aria-label="breadcrumb"
              maxItems={3}
              separator={<NavigateNext fontSize="small" color="primary" />}
            >
              {selectedPath.map((pathItem: any, pathIndex: number) => {
                const dom: any =
                  pathIndex < selectedPath.length - 1 ||
                    selectedPath.length == 1 ? (
                      <Link
                        href="#"
                        onClick={() => {
                          getGroupTree(pathItem._key);
                          let newCompanyItem = _.cloneDeep(companyItem);
                          newCompanyItem.config.startId = pathItem._key;
                          api.member.setConfig(
                            newCompanyItem.groupMemberKey,
                            newCompanyItem.config
                          );
                          dispatch(changeCompanyItem(newCompanyItem));
                        }}
                        style={{ fontSize: '14px', color: '#fff' }}
                        // color={'primary'}
                        underline={'none'}
                        key={'path' + pathIndex}
                      >
                        {pathItem.name}
                      </Link>
                    ) : (
                      <Typography
                        color={'primary'}
                        // onClick={() => {
                        //   getGroupTree(pathItem._key);
                        // }}
                        style={{ fontSize: '14px' }}
                        key={'path' + pathIndex}
                      >
                        {pathItem.name}
                      </Typography>
                    );
                return dom;
              })}
            </Breadcrumbs>
          </div>) : null}
      </React.Fragment>
      <Dialog
        visible={cloneGroupVisible}
        onClose={() => {
          setCloneGroupVisible(false);
        }}
        onOK={() => {
          setCloneGroupVisible(false);
          cloneGroup();
        }}
        title={'克隆群'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">是否克隆群:{cloneGroupName}</div>
      </Dialog>
    </div>
  );
};
Contact.defaultProps = {
  contactIndex: 0,
};
export default Contact;
