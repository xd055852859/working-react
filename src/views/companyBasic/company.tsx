import React, { useState, useEffect, useRef } from 'react';
import './company.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { getGroupInfo } from '../../redux/actions/groupActions';
import { useDispatch } from 'react-redux';
import { Dropdown, Select, Row, Col, Avatar } from 'antd';
const { Option } = Select;
import _ from 'lodash';
import api from '../../services/api';

import { setMessage } from '../../redux/actions/commonActions';

import Loading from '../../components/common/loading';
import CompanyHeader from './companyHeader';
import LiquidChart from '../../components/common/chart/liquidChart';
import LineChart from '../../components/common/chart/lineChart';

import defaultPersonPng from '../../assets/img/defaultPerson.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import carePng from '../../assets/img/care.png';
import uncarePng from '../../assets/img/uncare.png';
import companyTab1Svg from '../../assets/svg/companyTab1.svg';
import companyTab2Svg from '../../assets/svg/companyTab2.svg';
import companyTab3Svg from '../../assets/svg/companyTab3.svg';
import companyTab4Svg from '../../assets/svg/companyTab4.svg';
import moment from 'moment';
interface CompanyProps {}

const Company: React.FC<CompanyProps> = (props) => {
  const {} = props;
  const mainEnterpriseGroup = useTypedSelector(
    (state) => state.auth.mainEnterpriseGroup
  );
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const allTask = useTypedSelector((state) => state.auth.allTask);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [companyListData, setCompanyListData] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [careType, setCareType] = useState(2);
  const groupTabArray = [
    '项目图标',
    '项目名',
    '总任务',
    '待完成',
    '逾期数',
    '昨日活力',
    '活力排名',
    '7天活力趋势',
    '关注',
  ];
  const MemberTabArray = [
    '头像',
    '姓名',
    '总活力值',
    '待完成度',
    '逾期数',
    '昨日活力',
    '活力排名',
    '7天活力趋势',
    '关注',
  ];
  let unDistory = useRef<any>(null);
  unDistory.current = true;

  useEffect(() => {
    if (mainEnterpriseGroup.mainEnterpriseGroupKey) {
      dispatch(getGroupInfo(mainEnterpriseGroup.mainEnterpriseGroupKey));
      getData(mainEnterpriseGroup.mainEnterpriseGroupKey);
      getListData(mainEnterpriseGroup.mainEnterpriseGroupKey);
    }
  }, [mainEnterpriseGroup]);
  useEffect(() => {
    if (mainEnterpriseGroup.mainEnterpriseGroupKey) {
      getListData(mainEnterpriseGroup.mainEnterpriseGroupKey);
    }
  }, [tabIndex, careType]);
  const getData = async (companyKey) => {
    // let newCompanyData: any = {};
    let companyRes: any = await api.company.getEnterpriseGroupData(companyKey);
    if (companyRes.msg === 'OK') {
      console.log(companyRes.result);
      setCompanyData(companyRes.result);
    } else {
      dispatch(setMessage(true, companyRes.msg, 'error'));
    }
  };
  const getListData = async (companyKey) => {
    let companyRes: any = null;
    if (tabIndex) {
      companyRes = await api.company.getEnterpriseMemberList(
        companyKey,
        careType,
        1,
        20
      );
    } else {
      companyRes = await api.company.getEnterpriseGroupList(
        companyKey,
        careType,
        1,
        20
      );
    }
    // let newCompanyData: any = {};
    if (companyRes.msg === 'OK') {
      companyRes.result = companyRes.result.map((item, index) => {
        item.energyValueArray = item.energyValueArray.map(
          (energyItem, energyIndex) => {
            return {
              name: moment(energyItem.date).format('dddd'),
              value: energyItem.value,
            };
          }
        );
        return item;
      });
      console.log(companyRes.result);
      setCompanyListData(companyRes.result);
    } else {
      dispatch(setMessage(true, companyRes.msg, 'error'));
    }
  };
  const changeCare = (type: number, key: string, index: number) => {
    let newCompanyListData = _.cloneDeep(companyListData);
    let status: number = newCompanyListData[index].isCare ? 2 : 1;
    newCompanyListData[index].isCare = !newCompanyListData[index].isCare;
    api.auth.dealCareFriendOrGroup(type, key, status);
    setCompanyListData(newCompanyListData);
  };
  return (
    <div className="companyBasic">
      <CompanyHeader />
      {loading ? <Loading /> : null}
      <div className="companyBasic-container">
        <Row gutter={[16, 14]}>
          <Col span={6}>
            <div className="companyBasic-tab-item">
              <div className="companyBasic-tab-item-top">
                <img src={companyTab1Svg} alt="" />
                <span>
                  {companyData?.yestodayMyEnergyValue
                    ? +companyData?.yestodayMyEnergyValue.toFixed(1)
                    : 0}
                </span>
              </div>
              <div className="companyBasic-tab-item-bottom">
                昨日我的活力 同比{' '}
                {companyData?.yestodayMyEnergyValueTB
                  ? companyData.yestodayMyEnergyValueTB > 0
                    ? '+ ' + companyData.yestodayMyEnergyValueTB
                    : companyData.yestodayMyEnergyValueTB
                  : 0}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="companyBasic-tab-item">
              <div className="companyBasic-tab-item-top">
                <img src={companyTab2Svg} alt="" />
                <span>
                  {companyData?.yestodayUserAverageEnergy
                    ? +companyData?.yestodayUserAverageEnergy.toFixed(1)
                    : 0}
                </span>
              </div>
              <div className="companyBasic-tab-item-bottom">
                昨日人均活力 同比{' '}
                {companyData?.yestodayUserAverageEnergyTB
                  ? companyData.yestodayUserAverageEnergyTB > 0
                    ? '+ ' + companyData.yestodayUserAverageEnergyTB
                    : companyData.yestodayUserAverageEnergyTB
                  : 0}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="companyBasic-tab-item">
              <div className="companyBasic-tab-item-top">
                <img src={companyTab3Svg} alt="" />
                <span>
                  {companyData?.clockInUserNumber} /{' '}
                  <span style={{ fontSize: '14px' }}>
                    {companyData?.totalUserNumber}
                  </span>
                </span>
              </div>
              <div className="companyBasic-tab-item-bottom">
                今日打卡人数/总人数
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="companyBasic-tab-item">
              <div className="companyBasic-tab-item-top">
                <img src={companyTab4Svg} alt="" />
                <div>
                  {companyData ? (
                    <LiquidChart
                      percent={parseFloat(
                        (
                          companyData.userOnlineNumber /
                          companyData.totalUserNumber
                        ).toFixed(1)
                      )}
                      zoom={0.2}
                      liquidId={'companyBasic-top-liquid'}
                      fillColor={'#17B881'}
                    />
                  ) : null}
                </div>
              </div>
              <div className="companyBasic-tab-item-bottom">员工上线率</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="companyBasic-tab-bottomItem">
              <div className="companyBasic-tab-bottomItem-title">
                昨日·项目活力榜
              </div>
              {companyData?.getYestodayGroupEnergyRankingList.map(
                (item, index) => {
                  return (
                    <div
                      className="companyBasic-tab-bottomItem-item"
                      key={'yestodayGroupEnergy' + index}
                    >
                      <div className="companyBasic-tab-bottomItem-left">
                        <div>{index + 1}</div>
                        <div
                          className="companyBasic-tab-bottomItem-img"
                          style={{ borderRadius: '5px' }}
                        >
                          <img
                            src={
                              item.groupLogo
                                ? item.groupLogo
                                : defaultGroupPng
                            }
                            alt=""
                          />
                        </div>
                        <div>{item.groupName}</div>
                      </div>
                      <div>
                        {item.energyValue ? parseInt(item.energyValue) : 0}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </Col>
          <Col span={6}>
            <div className="companyBasic-tab-bottomItem">
              <div className="companyBasic-tab-bottomItem-title">
                昨日·创造之星
              </div>
              {companyData?.getYestodayCreatorRankingList.map((item, index) => {
                return (
                  <div
                    className="companyBasic-tab-bottomItem-item"
                    key={'yestodayCreator' + index}
                  >
                    <div className="companyBasic-tab-bottomItem-left">
                      <div>{index + 1}</div>
                      <div
                        className="companyBasic-tab-bottomItem-img"
                        style={{ borderRadius: '50%' }}
                      >
                        <img
                          src={
                            item.avatar
                              ? item.avatar +
                                '?imageMogr2/auto-orient/thumbnail/80x'
                              : defaultPersonPng
                          }
                          alt=""
                        />
                      </div>
                      <div>{item.nickName}</div>
                    </div>
                    <div>{item.createNumber ? item.createNumber : 0}</div>
                  </div>
                );
              })}
            </div>
          </Col>
          <Col span={6}>
            <div className="companyBasic-tab-bottomItem">
              <div className="companyBasic-tab-bottomItem-title">
                昨日·执行之王
              </div>
              {companyData?.getYestodayExecutorRankingList.map(
                (item, index) => {
                  return (
                    <div
                      className="companyBasic-tab-bottomItem-item"
                      key={'yestodayExecutor' + index}
                    >
                      <div className="companyBasic-tab-bottomItem-left">
                        <div>{index + 1}</div>
                        <div
                          className="companyBasic-tab-bottomItem-img"
                          style={{ borderRadius: '50%' }}
                        >
                          <img
                            src={
                              item.avatar
                                ? item.avatar +
                                  '?imageMogr2/auto-orient/thumbnail/80x'
                                : defaultPersonPng
                            }
                            alt=""
                          />
                        </div>
                        <div>{item.nickName}</div>
                      </div>
                      <div>{item.executeNumber ? item.executeNumber : 0}</div>
                    </div>
                  );
                }
              )}
            </div>
          </Col>
          <Col span={6}>
            <div className="companyBasic-tab-bottomItem">
              <div className="companyBasic-tab-bottomItem-title">
                我的今日完成度
              </div>
              {allTask[0] > 0 ? (
                <div className="companyBasic-tab-bottomItem-chart">
                  <LiquidChart
                    percent={parseFloat(
                      ((allTask[0] - allTask[1]) / allTask[0]).toFixed(1)
                    )}
                    zoom={0.3}
                    liquidId={'companyBasic-bottom-liquid'}
                    fillColor={'#1890ff'}
                  />
                </div>
              ) : null}
            </div>
          </Col>
        </Row>
        <div className="companyBasic-box">
          <div className="companyBasic-box-nav">
            <div className="companyBasic-box-nav-item">
              <span
                onClick={() => {
                  setTabIndex(0);
                }}
                style={
                  tabIndex === 0
                    ? { borderBottom: '2px solid #fff', color: '#fff' }
                    : {}
                }
              >
                {careType === 2 ? '关注' : '参与'}项目
              </span>
            </div>
            <div className="companyBasic-box-nav-item">
              <span
                onClick={() => {
                  setTabIndex(1);
                }}
                style={
                  tabIndex === 1
                    ? { borderBottom: '2px solid #fff', color: '#fff' }
                    : {}
                }
              >
                {careType === 2 ? '关注' : '参与'}队友
              </span>
            </div>
            <Select
              value={careType}
              style={{ width: 120 }}
              onChange={(value) => {
                setCareType(value);
              }}
            >
              <Option value={2}>我关注的</Option>
              <Option value={1}>我参与的</Option>
            </Select>
          </div>
          <div className="company-group-th">
            {tabIndex
              ? MemberTabArray.map((memberItem, memberIndex) => {
                  return <div key={'memberTh' + memberIndex}>{memberItem}</div>;
                })
              : groupTabArray.map((groupItem, groupIndex) => {
                  return <div key={'groupTh' + groupIndex}>{groupItem}</div>;
                })}
          </div>
          {companyListData
            ? tabIndex
              ? companyListData.map((companyGroupItem, companyGroupIndex) => {
                  return (
                    <div
                      className="company-group-tr"
                      key={'companyGroup' + companyGroupIndex}
                    >
                      <div>
                        <div style={{ borderRadius: '50%' }}>
                          <img
                            src={
                              companyGroupItem.avatar
                                ? companyGroupItem.avatar +
                                  '?imageMogr2/auto-orient/thumbnail/80x'
                                : defaultPersonPng
                            }
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="toLong">{companyGroupItem.nickName}</div>
                      <div>{parseInt(companyGroupItem.energyValueTotal)}</div>
                      <div>{companyGroupItem.notFinishTaskNumber}</div>
                      <div>{companyGroupItem.overTimeTaskNumber}</div>
                      <div>{parseInt(companyGroupItem.energyValue)}</div>
                      <div>{companyGroupItem.ranking}</div>
                      <div>
                        <LineChart
                          data={companyGroupItem.energyValueArray}
                          chartHeight={60}
                          lineId={
                            'groupLine' +
                            (careType === 1 ? 'join' : 'care') +
                            companyGroupIndex
                          }
                          zoom={0.5}
                        />
                      </div>
                      <div
                        onClick={() => {
                          changeCare(
                            1,
                            companyGroupItem.userKey,
                            companyGroupIndex
                          );
                        }}
                      >
                        <img
                          src={companyGroupItem.isCare ? carePng : uncarePng}
                          alt=""
                          style={{ width: '28px', height: '26px' }}
                        />
                      </div>
                    </div>
                  );
                })
              : companyListData.map((companyMemberItem, companyMemberIndex) => {
                  return (
                    <div
                      className="company-group-tr"
                      key={'companyMember' + companyMemberIndex}
                    >
                      <div>
                        <div>
                          <img
                            src={
                              companyMemberItem.groupLogo
                                ? companyMemberItem.groupLogo +
                                  '?imageMogr2/auto-orient/thumbnail/80x'
                                : defaultGroupPng
                            }
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="toLong">
                        {companyMemberItem.groupName}
                      </div>
                      <div> {companyMemberItem.serialNumber}</div>
                      <div>{companyMemberItem.notFinishTaskNumber} </div>
                      <div>{companyMemberItem.overTimeTaskNumber}</div>
                      <div>{parseInt(companyMemberItem.energyValue)} </div>
                      <div>{companyMemberItem.ranking}</div>
                      <div>
                        <LineChart
                          data={companyMemberItem.energyValueArray}
                          chartHeight={60}
                          lineId={
                            'groupMember' +
                            (careType === 1 ? 'join' : 'care') +
                            companyMemberIndex
                          }
                          zoom={0.5}
                        />
                      </div>
                      <div
                        onClick={() => {
                          changeCare(
                            2,
                            companyMemberItem.groupKey,
                            companyMemberIndex
                          );
                        }}
                      >
                        <img
                          src={companyMemberItem.isCare ? carePng : uncarePng}
                          alt=""
                          style={{ width: '28px', height: '26px' }}
                        />
                      </div>
                    </div>
                  );
                })
            : null}
        </div>
      </div>
    </div>
  );
};
Company.defaultProps = {};
export default Company;
