import React, { useEffect, useState } from 'react';
import Loadable from 'react-loadable';
import { useDispatch } from 'react-redux';
import Loading from '../../../common/loading';
import './index.css';
// import { clearArticle } from '../../../redux/actions/articleActions';

const DrawView = Loadable({
  loader: () => import('../../DrawView'),
  loading: () => <Loading />,
});

const DrawEditor = Loadable({
  loader: () => import('../../Topology'),
  loading: () => <Loading />,
});

interface Props {
  editMode?: boolean;
  hideEditButton?: boolean;
}

export default function ToggleEdit({ editMode, hideEditButton }: Props) {
  const dispatch = useDispatch();
  const [editor, setEditor] = useState(false);
 //  const article = useTypedSelector((state) => state.article.article);

  useEffect(() => {
    return () => {
      // dispatch(clearArticle());
      sessionStorage.setItem('isEdit', '0');
    };
  }, [dispatch]);

  // useEffect(() => {
  //   if (article) {
  //     setEditor(false);
  //   }
  // }, [article]);

  return (
    <div
      className="taggle-container"
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditor(true);
      }}
    >
      {editMode ? (
        <DrawEditor embed={true} />
      ) : editor ? (
        <DrawEditor embed={true} />
      ) : (
        <DrawView embed={true} handleEdit={() => setEditor(true)} hideEditButton={hideEditButton} />
      )}
    </div>
  );
}
