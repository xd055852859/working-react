import React, { useState, useEffect, useRef } from 'react';
import './companySearch.css';
import { Button } from '@material-ui/core';
import { MenuTree } from 'tree-graph-react';
import { useDispatch } from 'react-redux';
import api from '../../services/api';
import _ from 'lodash';
import { setMessage } from '../../redux/actions/commonActions';
interface CompanySearchProps {
  addMember?: any;
  targetGroupKey: string;
  searchType?: string;
}

const CompanySearch: React.FC<CompanySearchProps> = (props) => {
  const { addMember, targetGroupKey, searchType } = props;
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState<any>(null);
  const [searchInput, setSearchInput] = useState<any>('');
  const [selectedId, setSelectedId] = useState<any>(null);
  const [startId, setStartId] = useState<any>(null);

  const searchPerson = async () => {
    let newSearchData: any = {};
    let searchPersonRes: any = await api.company.searchStaff(
      targetGroupKey,
      searchInput
    );
    if (searchPersonRes.msg === 'OK') {
      let data = searchPersonRes.result;
      console.log(data);
      for (let key in data) {
        newSearchData[key] = {
          _key: data[key]._key,
          contract: false,
          father: data[key].parentOrgKey,
          name:
            data[key].orgType === 1
              ? data[key].name
              : data[key].name +
                ' (' +
                (data[key].post ? data[key].post : '无职务') +
                ' )',
          sortList: data[key].children,
          enterpriseGroupKey: data[key].enterpriseGroupKey,
          groupMemberKey: data[key].groupMemberKey,
          orgType: data[key].orgType,
          staffKey: data[key].staffKey,
          disabled: data[key].orgType === 1,
        };
        if (!data[key].parentOrgKey) {
          setStartId(data[key]._key);
        }
      }
      setSearchData(newSearchData);
      // setRows(newRow);
    } else {
      dispatch(setMessage(true, searchPersonRes.msg, 'error'));
    }
  };

  const chooseNode = async (node: any) => {
    setSelectedId(node._key);
    // setRows(newRow);
  };

  return (
    <div className="companySearch">
      <div className="companySearch-container">
        <input
          type="text"
          value={searchInput}
          onChange={(e: any) => {
            setSearchInput(e.target.value);
          }}
          placeholder="请输入成员名"
          className="companySearch-input"
          onKeyDown={(e: any) => {
            if (e.keyCode === 13) {
              searchPerson();
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            searchPerson();
          }}
          className="companySearch-button"
        >
          搜索
        </Button>
      </div>
      <div className="companySearch-tree">
        {searchData && startId ? (
          <MenuTree
            nodes={searchData}
            uncontrolled={false}
            showMoreButton
            startId={startId}
            backgroundColor="#f5f5f5"
            color="#333"
            defaultSelectedId={selectedId}
            handleClickNode={(node: any) => {
              chooseNode(node);
            }}
            hoverColor="#595959"
            handleClickMoreButton={(node: any) => {
              if (searchType === '添加') {
                addMember(node);
              }
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
CompanySearch.defaultProps = {};
export default CompanySearch;
