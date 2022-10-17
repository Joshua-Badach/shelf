import * as React from "react";
import { Icon } from "@blueprintjs/core";

export interface IBook {
  id: string;
  title: string;
  coverImage: string;
  author: string;
  available_for_extension: boolean;
}

export interface IBookProps {
  activation?: object;
  book: IBook;
  setOpenBook: (number) => void;
  setBackBook: (number) => void;
  adjustedIndex: number;
  index: number;
  open: boolean;
  back: boolean;
  expire: string;
  courseName: string;
  description: string;
  side: boolean;
  total: number;
  middle: number;
}

interface IBookState {
  closing?: boolean;
}

export default class Book extends React.Component<IBookProps, IBookState> {
  public state = {
    popupMenuStudent: false,
    popupMenuSubscription: false,
    popupMenuDelete: false,
    showConfirmModal: false
  };

  public toggleOpen = () => {
    if (Object.keys(this.props.hrefs || {}).length) {
      let first;
      const hasNames = Object.keys(this.props.hrefs).reduce(
        (a, b) => {
          if (!first) first = b;
          if (this.props.hrefs[b]) return true;
          return a;
        }, false);
      if (!hasNames && first) {
        return this.props.router.history.push(first);
      } else if (!hasNames) {
        return;
      }
    }
    const doIt = () => this.props.setOpenBook(this.props.open ? null : this.props.adjustedIndex);
    if (this.props.open) {
      this.setState({ closing: true }, doIt);
      setTimeout(() => this.setState({ closing: false }), 250);
    } else {
      doIt();
    }
    this.setState({ showConfirmModal: false });
  }
  public toggleBack = () =>
    this.props.setBackBook(this.props.back ? null : this.props.adjustedIndex)
  public manageStudents = () => {
    this.setState({ popupMenuStudent: !this.state.popupMenuStudent });
  }
  public manageSubscriptions = () => {
    this.setState({ popupMenuSubscription: !this.state.popupMenuSubscription });
  }
  public manageDelete = () => {
    this.setState({ popupMenuDelete: !this.state.popupMenuDelete });
  }

  public toggleConfirm() {
    this.setState({ showConfirmModal: !this.state.showConfirmModal });
  }

  protected activate = () => {
    this.props.api.post({
      ...this.props.activation || {},
      course: this.props.book.id,
      actNow: true,
    });
  };

  protected purchase = () =>
    this.props.api.post({
      action: 'purchase',
      course: this.props.book.id
    });

  public render() {
    const {
      book: { author, title, coverImage, id, available_for_extension, href },
      index, total, side, open, back, expire, courseName, description,
      hrefs, router, activation,
    } = this.props;
    const { closing } = this.state;

    let zIndex = 1;
    // let middle = index/2;


    if (side) {
      if (index < (total / 2) - 1) {
        // $parent.css( 'z-index', i ).data( 'stackval', i );
        zIndex += index;
      } else {
        // $parent.css( 'z-index', booksCount - 1 - i ).data( 'stackval', booksCount - 1 - i );
        zIndex -= index - 1 - total;
      }
    }

    if (open || back || closing) {
      zIndex = 100
    }

    if (available_for_extension) {

    }

    return <li style={open || side ? { zIndex } : {}}>
      <div className={`bk-book book-1 bk-${open ? 'viewinside' :
        back ? 'viewback' : 'bookdefault'}`} id={id}>
        <div className="bk-front" onClick={this.toggleOpen}>
          <div className="bk-cover-back" onClick={this.toggleOpen} />
          <div className="bk-cover">
            <img src={coverImage} width={"100%"} height={"100%"} />
            {/* <h2>
              <span>{title}</span>
            </h2> */}
          </div>
        </div>
        <div className="bk-page">
          <div style={{ width: '100%', height: '100%', display: 'table' }}>
            <div style={{ width: '100%', height: '100%', display: 'table-cell', verticalAlign: 'middle' }}>
              {Object.keys(hrefs || {}).length
                ? Object.keys(hrefs).map(href =>
                  <p>
                    <a {...{ href }}
                      onClick={(e) => {
                        e.preventDefault();
                        router.history.push(href);
                      }}>{hrefs[href]}</a>
                  </p>)
                : <>
                  {href ? <button onClick={() => (window.location = href)} className={'bp3-button bp3-intent-success bp3-large'}>Open Reader</button> : ''}
                </>}
            </div>
          </div>
        </div>
        <div className="bk-back" onClick={this.toggleOpen}>
          <h2>{title}</h2>
          <h4>{author}</h4>
          <p>{description}Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquam atque consequuntur
            distinctio dolorem doloribus eligendi enim et facere id impedit magni natus, necessitatibus non provident
            ratione similique veniam, veritatis.</p>
          <p>{expire}Expiration Date</p>
        </div>
        <div className="bk-right"></div>
        <div className="bk-left" onClick={this.toggleOpen}>
          <h2>
            <span>{title}</span>
          </h2>
        </div>
        <div className="bk-top"></div>
        <div className="bk-bottom"></div>
      </div>
    </li>
  }
}
