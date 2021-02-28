import React from 'react';
import {
  fade,
  makeStyles,
  withStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import {
  AddBoxOutlined,
  IndeterminateCheckBoxOutlined,
  CropDinOutlined,
} from '@material-ui/icons';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import Collapse from '@material-ui/core/Collapse';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import { TransitionProps } from '@material-ui/core/transitions';
import _ from 'lodash';

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const StyledTreeItem = withStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      '& .close': {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
  })
)((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
));

const useStyles = makeStyles(
  createStyles({
    root: {
      height: 264,
      flexGrow: 1,
      maxWidth: '100%',
    },
  })
);
interface MiniTreeProps {
  startId: string;
  nodes: any;
  clickFunc: React.MouseEventHandler;
}
const MiniTree: React.FC<MiniTreeProps> = (props) => {
  const classes = useStyles();
  const { startId, nodes, clickFunc } = props;
  const renderTree = (nodes: any) => (
    <StyledTreeItem
      key={nodes._key}
      nodeId={nodes._key}
      label={nodes.name}
      onLabelClick={() => {
        clickFunc(nodes._key);
      }}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node: any) => renderTree(node))
        : null}
    </StyledTreeItem>
  );
  return (
    <TreeView
      className={classes.root}
      defaultExpanded={[startId]}
      defaultCollapseIcon={<IndeterminateCheckBoxOutlined />}
      defaultExpandIcon={<AddBoxOutlined />}
      defaultEndIcon={<CropDinOutlined />}
    >
      {renderTree(nodes)}
      {/* <StyledTreeItem nodeId="1" label="Main">
        <StyledTreeItem nodeId="2" label="Hello" />
        <StyledTreeItem nodeId="3" label="Subtree with children">
          <StyledTreeItem nodeId="6" label="Hello" />
          <StyledTreeItem nodeId="7" label="Sub-subtree with children">
            <StyledTreeItem nodeId="9" label="Child 1" />
            <StyledTreeItem nodeId="10" label="Child 2" />
            <StyledTreeItem nodeId="11" label="Child 3" />
          </StyledTreeItem>
          <StyledTreeItem nodeId="8" label="Hello" />
        </StyledTreeItem>
        <StyledTreeItem nodeId="4" label="World" />
        <StyledTreeItem nodeId="5" label="Something something" />
      </StyledTreeItem> */}
    </TreeView>
  );
};
MiniTree.defaultProps = {};
export default MiniTree;
