import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-wall-linker',
  templateUrl: './wall-linker.component.html',
  styleUrls: ['./wall-linker.component.css']
})
export class MediaWallLinkerComponent implements OnInit {
  @Input() text: string;
  @Input() hashtags: string[] = new Array<string>();
  @Input() mentions: string[] = new Array<string>();
  @Input() links: string[] = new Array<string>();
  @Input() unshorten: Object = {};
  @Input() useAll: Boolean = false;
  @Output() onShowed = new EventEmitter<boolean>();
  public shardArray: Array<Shard> = new Array<Shard>();

  constructor() { }

  ngOnInit() {
    if (this.useAll) {
      this.generateAllShards();
    } else {
      this.generateShards();
    }
  }

  showHideLightbox(shard: Shard) {
    if (shard.type === 1) {
      window.open(shard.linkTo, '_blank');
    }
    this.onShowed.emit(true);
  }
  getIndicesOf(text: string, str: string, caseSensitive = true): number[] {
    if (!str.length) {
      return [];
    }

    let startIndex = 0;
    let index: number;
    const indices: number[] = new Array<number>();

    if (!caseSensitive) {
      text = text.toLowerCase();
      str = str.toLowerCase();
    }

    while ((index = text.indexOf(str, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + str.length;
    }

    return indices;
  }




  private generateShards() {
    const indexedChunks: StringIndexedChunks[] = [];

    this.hashtags.forEach(hashtag => {
      const indices = this.getIndicesOf(this.text, `#${hashtag}`, false);
      indices.forEach(idx => {
        indexedChunks.push({index: idx, str: `#${hashtag}`, type: ShardType.hashtag});
      });
    });

    this.mentions.forEach(mention => {
      const indices = this.getIndicesOf(this.text, `@${mention}`, false);
      indices.forEach(idx => {
        indexedChunks.push({index: idx, str: `@${mention}`, type: ShardType.mention});
      });
    });

    // Combining shortened and normal links.
    let allLinks: string[] = [];
    const unshortenKeys: string[] = Object.keys(this.unshorten);
    const unshortenValues: string[] = [];

    unshortenKeys.forEach(key => unshortenValues.push(this.unshorten[key]));

    for (const link of this.links) {
      let insert = true;
      for (let shortened of unshortenValues) {
        shortened = shortened.substring(0, shortened.length - 3);
        if (link.startsWith(shortened)) {
          insert = false;
          break;
        }
      }
      if (insert) {
        allLinks.push(link);
      }
    }

    allLinks = [...unshortenKeys, ...allLinks];

    allLinks.forEach(link => {
      const indices = this.getIndicesOf(this.text, link, false);
      indices.forEach(idx => {
        indexedChunks.push({index: idx, str: link, type: ShardType.link});
      });
    });

    indexedChunks.sort((a, b) => { return (a.index > b.index) ? 1 : (a.index < b.index) ? -1 : 0; });

    let startIndex = 0;
    const endIndex = this.text.length;

    indexedChunks.forEach(element => {
      if (startIndex !== element.index) {
        const shard = new Shard(ShardType.plain, this.text.substring(startIndex, element.index));
        this.shardArray.push(shard);
        startIndex = element.index;
      }
      if (startIndex === element.index) {
        const str = this.text.substring(startIndex, element.index + element.str.length);
        const shard = new Shard(element.type, str);
        switch (element.type) {
          case ShardType.link: {
            if (this.unshorten[element.str]) {
              shard.linkTo = str;
              shard.text = this.unshorten[element.str];
            } else {
              shard.linkTo = str;
            }
            break;
          }

          case ShardType.hashtag: {
            shard.linkTo = ['/wall'];
            shard.queryParams = { query : str };
            break;
          }

          case ShardType.mention: {
            shard.linkTo = ['/wall'];
            shard.queryParams = { query : `from:${str.substring(1)}` };
            break;
          }
        }
        this.shardArray.push(shard);
        startIndex += element.str.length;
      }
    });

    if (startIndex !== endIndex) {
      const shard = new Shard(ShardType.plain, this.text.substring(startIndex));
      this.shardArray.push(shard);
    }
  }

  private generateAllShards() {
    const splitTextArray = this.text.split(' ');
    for (const shardText of splitTextArray) {
      if (shardText[0] === '@' && shardText.length > 1) {
        const mentionShard = new Shard(ShardType.mention, shardText);
        mentionShard.linkTo = ['/wall'];
        mentionShard.queryParams = { query : `from:${shardText.substring(1)}` };
        this.shardArray.push(mentionShard);
      } else if (shardText[0] === '#' && shardText.length > 1) {
        const hashtagShard = new Shard(ShardType.hashtag, shardText);
        hashtagShard.linkTo = ['/wall'];
        hashtagShard.queryParams = { query : `#${shardText.substring(1)}` };
        this.shardArray.push(hashtagShard);
      } else if (this.stringIsURL(shardText)) {
        const linkShard = new Shard(ShardType.link, shardText);
        linkShard.linkTo = shardText;
        linkShard.text = shardText;

        if (this.unshorten.hasOwnProperty(shardText)) {
          linkShard.text = this.unshorten[shardText];
        }

        this.shardArray.push(linkShard);
      } else {
        this.shardArray.push(new Shard(ShardType.plain, shardText));
      }
    }
  }

  private stringIsURL(str: String): Boolean {
    const regexpPattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    const regexp = new RegExp(regexpPattern, 'ig');
    const searchRes = str.search(regexp);
    return (searchRes === 0) ? true : false;
  }
}


/**
 * @interface StringIndexedChunks
 *
 * The object with three properties, and is used for indexing the locations of linking points
 * in the main text.
 *
 * @property index : The starting index of that substring in the main text.
 * @property str : The actual substring to be searched for.
 * @property type : Type of the chunk, (hashtag, mention or link)
 */
interface StringIndexedChunks {
  index: number;
  str: string;
  type: ShardType;
}

/**
 * @enum ShardTypes : plain, link, hashtag, mention
 */
const enum ShardType {
  plain,		// 0
  link,			// 1
  hashtag,	// 2
  mention		// 3
}

/**
 * Each Shard contains following properties:
 *
 * @property type					: ShardType It specifies the the type of shard (plain,link,hashtag or mention)
 * @property text					: Text which is to be displayed.
 * @property linkType			: The type of link wheather internal or external.
 * @property linkTo				: The location where the route will eventually link.
 * @property queryParams	: The queryParams to use when redirecting (used incase of internal links).
 *
 */
class Shard {
  constructor (
    public type: ShardType = ShardType.plain,
    public text: String = '',
    public linkTo: any = null,
    public queryParams: any = null
  ) { }
}
