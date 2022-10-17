import * as React from "react";
import Style from "@pandarose/core/lib/browser/style";
import {StylePriority} from "@pandarose/core/lib/browser/style";
import {front, side} from './style';
import Book, {IBook} from "./book";

const chunk = require('lodash/chunk');

export enum Mode {
  Front = 'front',
  Side = 'side'
}

export interface IBookshelfProps {
  activation?: object | true;
  hrefs?: object;
  books: IBook[];
  mode: Mode
}

interface IBookshelfState {
  openBook: null | number;
  backBook: null | number;
}

const maxPerShelf = 20;
const maxPerShelfFront = 3;

function adjustIndex(index, shelfIndex) {
  return (shelfIndex * maxPerShelf) + index;
}

export default class Bookshelf extends React.Component<IBookshelfProps, IBookshelfState> {
  static defaultProps = {
    hrefs: {}
  }
  public state = {
    openBook: null,
    backBook: null,
  }
  public setOpenBook = (openBook) =>
    this.setState({openBook, backBook: null})
  public setBackBook = (backBook) =>
    this.setState({backBook, openBook: null});

  public render() {
    /* Extract the variables we need */
    const {
      props: {activation, value = [], mode, hrefs, router, api},
      state: {openBook, backBook},
      setOpenBook,
      setBackBook,
    } = this;

    const shelves = mode === Mode.Side
      ? chunk(value, maxPerShelf)
      : chunk(value, maxPerShelfFront);
    // : [value];

    return <React.Fragment>
      <Style priority={StylePriority.Low}>
        {mode === Mode.Side ? side() : front()}
      </Style>
      {shelves.map((shelf, shelfIndex) =>
        <ul className={'bk-list'}>
          <div className={'shelf'}>
            {shelf.map((book, index) =>
              <Book open={adjustIndex(index, shelfIndex) === openBook}
                    back={adjustIndex(index, shelfIndex) === backBook}
                    {...{
                      hrefs: hrefs[book.id],
                      book,
                      openBook,
                      setOpenBook,
                      setBackBook,
                      adjustedIndex: adjustIndex(index, shelfIndex),
                      index,
                      side: mode === Mode.Side,
                      total: shelf.length,
                      router, api, activation,
                    }}/>)}
          </div>
        </ul>)}
    </React.Fragment>
  }
}

export const element = (params, {api, combined, router}) =>
  <Bookshelf {...params}
             {...combined}
             {...{api, router}}/>

export function UIComponent({params}) {
  return <Bookshelf {...params}/>
}