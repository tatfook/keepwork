import AhoCorasick from 'aho-corasick.js'
import keepwork from '@/api/keepwork'
let repeatStr = (str, count) => {
  let repeatStr = str
  while (count > 1) {
    str += repeatStr
    count--
  }
  return str
}

let isEmptyObject = obj => {
  for (let t in obj) {
    return false
  }
  return true
}

let sensitive = {
  trie: new AhoCorasick.TrieNode(),
  checkTasks: [],
  init() {
    this.getSensitiveWordsList()
  },
  loadSensitiveWordsListIntoTrieNode(list) {
    let me = this
    if (isEmptyObject(me.trie.suffix)) {
      list.forEach(function(item) {
        me.trie.add(item.name, { word: item.name })
      })
    }
  },
  sensitiveWordsList: null,
  getSensitiveWordsList(callback) {
    let me = this
    if (this.sensitiveWordsList) {
      return callback && callback(me.sensitiveWordsList)
    } else {
      this.checkTasks.push(function() {
        callback && callback(me.sensitiveWordsList)
      })
    }

    if (me.isLoadingWordsList) return
    me.isLoadingWordsList = true

    keepwork.sensitiveWords
      .query({
        pageSize: 10000000
      })
      .then(data => {
        me.sensitiveWordsList = data.data
        me.loadSensitiveWordsListIntoTrieNode(me.sensitiveWordsList)
        while (me.checkTasks.length >= 1) {
          me.checkTasks.shift()()
        }
        me.isLoadingWordsList = false
      })
  },
  doCheckSensitiveWord(word, callback) {
    let me = this
    let foundWords = []
    if (!word) {
      callback && callback(foundWords, '')
      return
    }
    AhoCorasick.search(word, me.trie, function(foundWord, data) {
      foundWords.push(foundWord)
      word = word.replace(foundWord, repeatStr('●', foundWord.length))
    })
    callback && callback(foundWords, word)
  },
  checkSensitiveWord(word, callback) {
    // keep callback for Backward compatibility
    if (!word) {
      callback && callback()
      return Promise.resolve()
    }

    let me = this
    return new Promise(function(resolve, reject) {
      me.getSensitiveWordsList(function() {
        me.doCheckSensitiveWord(word, function(foundWords, word) {
          callback && callback(foundWords, word)
          resolve({
            foundWords,
            word
          })
        })
      })
    })
  },
  checkSensitiveWords(words) {
    words = Array.isArray(words) ? words : [words]

    let me = this
    return Promise.all(
      words.map(function(word) {
        return me.checkSensitiveWord(word)
      })
    ).then(function(results) {
      return results.filter(function(result) {
        return result && result.foundWords && result.foundWords.length
      })
    })
  },
  getAllSensitiveWords(words) {
    return this.checkSensitiveWords(words)
      .then(function(results) {
        return results.reduce(function(prev, result) {
          return prev.concat(result.foundWords)
        }, [])
      })
      .then(function(allFoundWords) {
        return allFoundWords
      })
  }
}

// sensitive.init();
export default sensitive
