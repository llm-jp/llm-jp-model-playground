import React, { useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Textarea from '../components/Textarea';
import ButtonIcon from '../components/ButtonIcon';
import RowItem from '../components/RowItem';
import useChatApi from '../hooks/useChatApi';
import { SliderField } from '@aws-amplify/ui-react';
import { create } from 'zustand';
import { UnrecordedMessage } from 'generative-ai-use-cases-jp';
import { PiMinusCircle, PiPlusCircle } from 'react-icons/pi';

type StateType = {
  loading: boolean;
  setLoading: (s: boolean) => void;
  system: string;
  setSystem: (s: string) => void;
  messages: UnrecordedMessage[];
  setMessages: (s: UnrecordedMessage[]) => void;
  maxNewTokens: number;
  setMaxNewTokens: (s: number) => void;
  temperature: number;
  setTemperature: (s: number) => void;
  repetitionPenalty: number;
  setRepetitionPenalty: (s: number) => void;
  topP: number;
  setTopP: (s: number) => void;
  clear: () => void;
};

const usePlaygroundPageState = create<StateType>((set) => {
  const INIT_STATE = {
    loading: false,
    system: '',
    messages: [{ role: 'user', content: '' }] as UnrecordedMessage[],
    maxNewTokens: 256,
    temperature: 0.7,
    repetitionPenalty: 1.05,
    topP: 0.99,
  };
  return {
    ...INIT_STATE,
    setLoading: (s: boolean) => {
      set(() => ({
        loading: s,
      }));
    },
    setSystem: (s: string) => {
      set(() => ({
        system: s,
      }));
    },
    setMessages: (s: UnrecordedMessage[]) => {
      set(() => ({
        messages: s,
      }));
    },
    setMaxNewTokens: (s: number) => {
      set(() => ({
        maxNewTokens: s,
      }));
    },
    setTemperature: (s: number) => {
      set(() => ({
        temperature: s,
      }));
    },
    setRepetitionPenalty: (s: number) => {
      set(() => ({
        repetitionPenalty: s,
      }));
    },
    setTopP: (s: number) => {
      set(() => ({
        topP: s,
      }));
    },
    clear: () => {
      set(INIT_STATE);
    },
  };
});

const PlaygroundPage: React.FC = () => {
  const {
    loading,
    setLoading,
    system,
    setSystem,
    messages,
    setMessages,
    maxNewTokens,
    setMaxNewTokens,
    temperature,
    setTemperature,
    repetitionPenalty,
    setRepetitionPenalty,
    topP,
    setTopP,
    clear,
  } = usePlaygroundPageState();
  const { state } = useLocation();
  const { predictStream } = useChatApi();

  const disabledExec = useMemo(() => {
    return loading;
  }, [loading]);

  useEffect(() => {
    if (state !== null) {
      setSystem(state.system);
      setMessages(state.messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const getGeneratedText = async () => {
    setLoading(true);

    console.log('system', system);

    const stream = predictStream({
      messages: [{ role: 'system', content: system }, ...messages],
      params: {
        max_new_tokens: maxNewTokens,
        temperature: temperature,
        repetition_penalty: repetitionPenalty,
        top_p: topP,
      },
    });

    messages.push({ role: 'assistant', content: '' });
    setMessages(messages);

    // Assistant の発言を更新
    for await (const chunk of stream) {
      messages[messages.length - 1].content += chunk.trim();
      setMessages(messages);
    }

    messages.push({ role: 'user', content: '' });

    setLoading(false);
  };

  // 実行
  const onClickExec = useCallback(() => {
    if (loading) return;
    getGeneratedText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, system, messages]);

  // メッセージの削除
  const onRemoveMessage = useCallback(
    (idx: number) => {
      if (loading) return;
      messages.splice(idx, 1);
      setMessages(messages);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, loading]
  );

  // メッセージの追加
  const onAddMessage = useCallback(
    () => {
      if (loading) return;
      const _role = messages.at(-1)?.role === 'user' ? 'assistant' : 'user';
      setMessages([...messages, { role: _role, content: '' }]);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, loading]
  );

  // リセット
  const onClickClear = useCallback(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-12">
      <div className="invisible col-span-12 my-0 flex h-0 items-center justify-center text-xl font-semibold lg:visible lg:my-5 lg:h-min">
        Playground
      </div>
      <div className="col-span-12 col-start-1 mx-2 lg:col-span-10 lg:col-start-2 xl:col-span-10 xl:col-start-2">
        <Card label="Playground">
          <div className="lg:flex">
            <div className="grow p-2">
              <div className="flex w-full items-center">
                <RowItem className="w-24">システム</RowItem>
                <div className="grow">
                  <Textarea
                    placeholder="システムプロンプト"
                    value={system}
                    onChange={setSystem}
                    maxHeight={-1}
                  />
                </div>
              </div>
              <div>
                {messages.map((message, idx) => (
                  <div className="flex items-center" key={idx}>
                    <RowItem className="w-24">
                      {message.role === 'user' ? 'ユーザー' : 'アシスタント'}
                    </RowItem>
                    <div className="grow">
                      <Textarea
                        className="grow"
                        placeholder={`${
                          message.role === 'user' ? 'ユーザー' : 'アシスタント'
                        } のメッセージ`}
                        value={message.content}
                        onChange={(s: string) => {
                          messages[idx].content = s;
                          setMessages(messages);
                        }}
                        maxHeight={-1}
                      />
                    </div>
                    <RowItem>
                      <ButtonIcon onClick={() => onRemoveMessage(idx)}>
                        <PiMinusCircle />
                      </ButtonIcon>
                    </RowItem>
                  </div>
                ))}
              </div>
              <Button outlined onClick={() => onAddMessage()}>
                <PiPlusCircle />
                メッセージの追加
              </Button>
            </div>
            <div>
              <div className="p-2">
                <SliderField
                  label="Temperature"
                  value={temperature}
                  onChange={setTemperature}
                  min={0}
                  max={2}
                  step={0.01}></SliderField>
                <SliderField
                  label="Max New Tokens"
                  value={maxNewTokens}
                  onChange={setMaxNewTokens}
                  min={0}
                  max={2048}
                  step={1}></SliderField>
                <SliderField
                  label="Repetition Penalty"
                  value={repetitionPenalty}
                  onChange={setRepetitionPenalty}
                  min={1.0}
                  max={2.0}
                  step={0.01}></SliderField>
                <SliderField
                  label="Top P"
                  value={topP}
                  onChange={setTopP}
                  min={0.01}
                  max={0.99}
                  step={0.01}></SliderField>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button outlined onClick={onClickClear} disabled={disabledExec}>
              クリア
            </Button>

            <Button disabled={disabledExec} onClick={onClickExec}>
              実行
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlaygroundPage;
